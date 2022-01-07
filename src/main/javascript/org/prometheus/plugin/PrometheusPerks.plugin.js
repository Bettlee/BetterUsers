/**
 * @name PrometheusPerks
 * @author NormalBettle437
 * @source https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js
 * @version 1.0.18
 * @description Allows you to locally assign a banner or an avatar of your choosing
 */

module.exports = (() => {

    const configuration = {
        "info": {
            "name": "PrometheusPerks",
            "authors": [{
                "name": "lemons",
                "discord_id": "407348579376693260",
                "github_username": "respecting"
            },
            {
                "name": "Shimoro",
                "discord_id": "427406422733619200",
                "github_username": "Shimoro-Rune"
            },
            {
                "name": "NormalBettle437",
                "discord_id": "725079599297331200",
                "github_username": "NormalBettle437"
            }],
            "source": "https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js",
            "updateUrl": "https://raw.githubusercontent.com/NormalBettle437/PrometheusPerks/main/src/main/javascript/org/prometheus/plugin/PrometheusPerks.plugin.js",
            "version": "1.0.18",
            "description": "Allows you to locally assign a banner or an avatar of your choosing"
        },
        "main": "PrometheusPerks.plugin.js"
    };
    return !global.ZeresPluginLibrary ? class {

        constructor() {

            this.configuration = configuration;
        }

        getName() {
            return configuration.info.name;
        }

        getAuthor() {
            return configuration.info.authors.map(v => v.name).join(", ");
        }

        getSource() {
            return configuration.info.source;
        }

        getUpdateUrl() {
            return configuration.info.updateUrl;
        }

        getVersion() {
            return configuration.info.version;
        }

        getDescription() {
            return configuration.info.description;
        }

        load() {

            BdApi.showConfirmationModal("Library Missing", `The library needed for ${configuration.info.name} is missing`, {

                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) {
                            return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        }
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }

        start() {
        }

        stop() {
        }
    } : (([Plugin, Api]) => {

        const plugin = (Plugin, Api) => {

            const { Patcher, DiscordAPI, Settings, Toasts, PluginUtilities } = Api;
            return class PrometheusPerks extends Plugin {

                defaults = { 
                    "clientsideAvatar": false,
                    "staticClientsideAvatar": false,
                    "clientsideBanner": false,
                    "avatarUrl": "", 
                    "staticAvatarUrl": "",
                    "bannerUrl": ""
                };

                settings = PluginUtilities.loadSettings(this.getName(), this.defaults);
                
                status = 0;
                clientside;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(_ => this.onStart(), ...[
                        new Settings.SettingGroup("Avatar").append(...[
                            new Settings.Switch("Clientside Avatar", "Enabled or disable a clientside avatar", this.settings.clientsideAvatar, value => this.settings.clientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using, supported types are, PNG, JPG, or GIF", this.settings.avatarUrl, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL!");
                                }
                                this.settings.avatarUrl = image;
                            }),
                            new Settings.Switch("Static Clientside Avatar", "Enable or disable a static clientside avatar", this.settings.staticClientsideAvatar, value => this.settings.staticClientsideAvatar = value),
                            new Settings.Textbox("URL", "The direct URL for the avatar you will be using that will act as a static placeholder for an animated image, supported types are, PNG, or JPG", this.settings.staticAvatarUrl, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL!");
                                }
                                this.settings.staticAvatarUrl = image;
                            })
                        ]),
                        new Settings.SettingGroup("Banner").append(...[
                            new Settings.Switch("Clientside Banner", "Enable or disable a clientside banner", this.settings.clientsideBanner, value => this.settings.clientsideBanner = value),
                            new Settings.Textbox("URL", "The direct URL for the banner you will be using, supported types are, PNG, JPG, or GIF", this.settings.bannerUrl, image => {
                                try {

                                    new URL(image);
                                } catch {
                                    return Toasts.error("This is an invalid URL!");
                                }
                                this.settings.bannerUrl = image;
                            })
                        ])
                    ]);
                }

                removeAvatar() {

                    clearInterval(this.clientsideAvatar && this.staticClientsideAvatar);

                    ["160", "100"].forEach(sizes => document.querySelectorAll(`[src = "${this.settings.avatarUrl}"]`).forEach(avatar => {
                                
                        avatar.src = `https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}`;
                        document.querySelectorAll(`.messageListItem-1-jvGY > [data-author-id="${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"]`).forEach((parent, index) => {
                                        
                            const element = document.querySelectorAll(`.messageListItem-1-jvGY > [data-author-id="${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatar-1BDn8e`)[index];
                            element.src = `https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}`;
                        });
                    }));

                    ["56", "40", "32", "20", "10"].forEach(sizes => document.querySelectorAll(`[src = "${this.settings.staticAvatarUrl}"]`).forEach(avatar => {
                                
                        avatar.src = `https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}`;
                    }));

                    document.querySelectorAll(`.avatarContainer-28iYmV.avatar-3tNQiO.avatarSmall-1PJoGO`).forEach(avatar => {
                                
                        avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}");`;
                    });

                    document.querySelectorAll(`.avatarUploaderInner-3UNxY3.avatarUploaderInner-mAGe3e`).forEach(avatar => {

                        avatar.style = `background-image: url("https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}");`;
                    });
                }

                removeBanner() {

                    clearInterval(this.clientsideBanner);

                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {
                        
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });
                    
                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {
                        
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none; width: none; height: none;`;
                    });

                    document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-26WQIb`).forEach(avatar => {
                        
                        avatar.style = `top: none;`;
                    });

					document.querySelectorAll(`[class *= "settingsBanner-"]`).forEach(banner => {
                        
                        banner.style = `background-image: none !important; background-repeat: none; background-position: none; background-size: none;`;
                    });

                    document.querySelectorAll(`.avatarUploaderInner-3UNxY3.bannerUploaderInnerSquare-1alXv4.banner-3vVQWW`).forEach(banner => {

                        banner.style = `background-image: none; background-size: none; width: none; height: none;`;
                    });
                }

                setAvatar() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if ((this.settings.clientsideAvatar && this.settings.staticClientsideAvatar) && (this.settings.avatarUrl && this.settings.staticAvatarUrl)) {

                        this.clientsideAvatar = setInterval(() => {

                            ["160", "100"].forEach(sizes => document.querySelectorAll(`[src = "https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}"]`).forEach(avatar => {
                                
                                avatar.src = this.settings.avatarUrl;
                                document.querySelectorAll(`.messageListItem-1-jvGY > [data-author-id="${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"]`).forEach((parent, index) => {
                                        
                                    const element = document.querySelectorAll(`.messageListItem-1-jvGY > [data-author-id="${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatar-1BDn8e`)[index];
                                    element.src = this.settings.staticAvatarUrl;
                                    
                                    parent.addEventListener("mouseover", () => {

                                        element.src = this.settings.avatarUrl;
                                    });

                                    parent.addEventListener("mouseout", () => {

                                        element.src = this.settings.staticAvatarUrl;
                                    });
                                });
                            }));

                            ["56", "40", "32", "20", "10"].forEach(sizes => document.querySelectorAll(`[src = "https://cdn.discordapp.com/avatars/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}/${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().avatar}.webp?size=${sizes}"]`).forEach(avatar => {
                                
                                avatar.src = this.settings.staticAvatarUrl;
                            }));

                            document.querySelectorAll(`.avatarContainer-28iYmV.avatar-3tNQiO.avatarSmall-1PJoGO`).forEach(avatar => {
                                
                                avatar.style = `background-image: url("${this.settings.staticAvatarUrl}");`;
                            });

                            document.querySelectorAll(`.avatarUploaderInner-3UNxY3.avatarUploaderInner-mAGe3e`).forEach(avatar => {

                                avatar.style = `background-image: url("${this.settings.avatarUrl}");`;
                            });
                        }, 100);
                    } 
                    if (!this.settings.clientsideAvatar) {

                        this.removeAvatar();
                    }
                }

                setBanner() {

                    PluginUtilities.saveSettings(this.getName(), this.settings);
                    if (this.settings.clientsideBanner && this.settings.bannerUrl) {

                        this.clientsideBanner = setInterval(() => {

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "profileBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 600px; height: 240px;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] div [class *= "popoutBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no repeat; background-position: 50%; background-size: cover; width: 300px; height: 120px;`;
                            });

                            document.querySelectorAll(`[data-user-id = "${ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().id}"] .avatarWrapperNormal-26WQIb`).forEach(avatar => {

                                avatar.style = `top: 76px;`;
                            });

                            document.querySelectorAll(`[class *= "settingsBanner-"]`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });

                            document.querySelectorAll(`.avatarUploaderInner-3UNxY3.bannerUploaderInnerSquare-1alXv4.banner-3vVQWW`).forEach(banner => {

                                banner.style = `background-image: url("${this.settings.bannerUrl}") !important; background-repeat: no-repeat; background-position: 50%; background-size: cover;`;
                            });
                        }, 100);
                    } 
                    if (!this.settings.clientsideBanner) {

                        this.removeBanner();
                    }
                }

                onStart() {
                    
                    this.status = ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType;
                    
                    this.setAvatar();
                    this.setBanner();
                    
                    ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = 2;
                }

                onStop() {
                    
                    ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser().premiumType = this.status

                    this.removeAvatar()
                    this.removeBanner();

                    Patcher.unpatchAll();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(configuration));
})();

import fs from "fs";
import { homedir } from "os";
import path from "path";
import { load_env } from "../../utils/load_env/index.js";
import { load_json } from "../../utils/load_json/index.js";
const app_path = (await import("../../utils/app_path/index.js")).app_path;

const default_prisma_schema_full_path = path.join(
    app_path,
    "server/utils/cli/commands/create_template/resources/schema.prisma",
);
const clean_up_schema = (dist_full_path: string, options: any) => {
    if (!options?.minimal) {
        fs.cpSync(default_prisma_schema_full_path, path.join(dist_full_path, "prisma/schema.prisma"));
    } else {
        fs.writeFileSync(
            path.join(dist_full_path, "prisma/schema.prisma"),
            `// database configuration 
generator client {
    output = "./client"
    binaryTargets = ["native", "debian-openssl-3.0.x"]
    provider      = "prisma-client-js"
}

datasource db {
    provider = "mysql"
    url      = "mysql://admin:admin@localhost:3306/your_db_name"
}

// end--of--db--config

        
        `,
        );
    }
};

const default_modules_index_file_full_path = path.join(
    app_path,
    "server/utils/cli/commands/create_template/resources/default_modules_index_file/index.ts",
);
const clean_up_modules = (dist_full_path: string) => {
    fs.cpSync(default_modules_index_file_full_path, path.join(dist_full_path, "server/modules/index.ts"));
};

const default_main_seeder_index_file_full_path = path.join(
    app_path,
    "server/utils/cli/commands/create_template/resources/main_seeder_index_file/index.run.js",
);
const clean_up_main_seeder = (dist_full_path: string) => {
    fs.cpSync(
        default_main_seeder_index_file_full_path,
        path.join(dist_full_path, "server/startup/_0_seed/index.run.js"),
    );
};

const default_dev_seeder_index_file_full_path = path.join(
    app_path,
    "server/utils/cli/commands/create_template/resources/dev_seeder_index_file/index.run.js",
);
const clean_up_dev_seeder = (dist_full_path: string) => {
    fs.cpSync(
        default_dev_seeder_index_file_full_path,
        path.join(dist_full_path, "server/startup/dev_seed/index.run.js"),
    );
};

const clean_up_git_ignore_file_of_static_resource = (dist_full_path) => {
    fs.writeFileSync(path.join(dist_full_path, "server/static/.gitignore"), "\n");
};

const clean_up_env = (
    dist_full_path: string,
    options: {
        [key: string]: boolean | string;
    },
) => {
    const env = load_env();
    const {
        minimal,
        keepModules,
        keepPackageInfo,
        keepRoutes,
        keepChannels,
        // dont clean up env static files if true
        keepStatic,
        keepMainSeeders,
        keepImages,
        keepDevSeeders,
    }: { [key: string]: boolean } = options as any;
    env.environment = "development";
    if (!keepStatic) {
        env.public_dirs = minimal
            ? [
                  {
                      local: "public",
                      remote: "/server/files",
                  },
                  {
                      local: "assets",
                      remote: "/server/assets",
                  },
                  {
                      local: "templates",
                      remote: "/server/templates",
                  },
              ]
            : [
                  {
                      local: "public",
                      remote: "/server/files",
                  },
                  {
                      local: "assets",
                      remote: "/server/assets",
                  },
                  {
                      local: "templates",
                      remote: "/server/templates",
                  },
                  {
                      local: "static/private_files",
                      remote: "/server/private-files",
                      middleware: "middlewares/static_resources/private_files.js",
                  },
              ];
    }

    if (!keepChannels) {
        env.channels = {
            sockets_prefix: "/server/channelling",
            channel_suffix_regx: "\\.channel\\.(?:js|ts)$",
            middleware_suffix_regx: "\\.middleware\\.(?:js|ts)$",
            channels_directory: "/channels",
            alias_suffix_regx: "\\.directory_alias\\.js$",
            description_suffix_regx: "\\.description\\.[a-zA-Z]{1,10}$",
        };
    }

    if (!keepRoutes) {
        env.router = {
            empty_route_path: "/routers/empty_route.ts",
            api_prefix: "/server/api",
            alias_suffix_regx: "\\.directory_alias\\.js$",
            alias_suffix: ".directory_alias.js",
            router_directory: "/routers",
            middleware_suffix_regx: "\\.middleware\\.(?:js|ts)$",
            router_suffix_regx: "\\.router\\.(?:js|ts)$",
            router_suffix: ".router.ts",
            description_suffix_regx: "\\.description\\.[a-zA-Z]{1,10}$",
            description_pre_extension_suffix: ".description",
            description_secret: crypto.randomUUID(),
        };
    }

    if (!keepPackageInfo && !keepImages) {
        env.corp = {
            name: "your org name",
            logo: {
                png: "YourCompanyLogo.png in assets/images",
                svg: "YourCompanyLogo.svg in assets/images",
            },
        } as any;
    }

    if (!keepModules && !keepPackageInfo) {
        env.client = {
            name: "Your Client Name", 
            logo: {
                png: "YourClientLogo.png in assets/images",
                svg: "YourClientLogo.svg in assets/images",
            },
        } as any;
    }

    if (!keepDevSeeders && !keepMainSeeders) {
        env.auth.seed_key = crypto.randomUUID() + crypto.randomUUID();
    }

    if (!keepModules) {
        env.auth.app_user_types_map = minimal
            ? {}
            : ({
                  "operator-dashboard": ["ADMIN", "SYSTEM", "OTHER", "EMPLOYEE"],
              } as any);

        env.auth.jwt = {
            options: null,
            secret: crypto.randomUUID() + crypto.randomUUID(),
        };

        env.auth.users_types = minimal
            ? []
            : [
                  {
                      name: "ADMIN",
                      show_name: "ADMIN",
                      description: "ADMIN",
                  },
                  {
                      name: "OTHER",
                      show_name: "OTHER",
                      description: "OTHER",
                  },
                  {
                      name: "SYSTEM",
                      show_name: "SYSTEM",
                      description: "SYSTEM",
                  },
                  {
                      name: "EMPLOYEE",
                      show_name: "EMPLOYEE",
                      description: "EMPLOYEE",
                  },
              ];

        env.jobs = {
            initial_jobs: [],
            job_checkout_interval_ms: 60000,
            worker: true,
        };
        env.log_mappers = minimal
            ? {}
            : ({
                  user_logs: {
                      model: "users_logs",
                      global_variables: {
                          user_id: "$.user.user_id",
                          user_full_name: "$.user.full_name",
                          user_username: "$.user.username",
                          user_phone: "$.user.phone",
                          user_email: "$.user.email",
                      },
                      log_maps: {
                          changed_user_password: {
                              template:
                                  "Updated User\nUser: %%user_full_name%% - %%user_username%% - \nhas changed User password who identified with username %%updated_user_username%% and full name %%updated_user_full_name%% and id %%updated_user_id%%",
                              variables: {
                                  user_id: "$.user.user_id",
                                  user_full_name: "$.user.full_name",
                                  user_username: "$.user.username",
                                  user_phone: "$.user.phone",
                                  user_email: "$.user.email",
                                  updated_user_id: "($.body.user.user_id)",
                                  updated_user_username: "($.body.user.username)",
                                  updated_user_full_name: "($.body.user.full_name)",
                              },
                          },
                          updated_user: {
                              template:
                                  "Updated User\nUser: %%user_full_name%% - %%user_username%% - \nhas updated User with username %%updated_user_username%% and full name %%updated_user_full_name%% and id %%updated_user_id%%",
                              variables: {
                                  user_id: "$.user.user_id",
                                  user_full_name: "$.user.full_name",
                                  user_username: "$.user.username",
                                  user_phone: "$.user.phone",
                                  user_email: "$.user.email",
                                  updated_user_id: "($.body.user.user_id)",
                                  updated_user_username: "($.body.username || $.body.user.username)",
                                  updated_user_full_name: "($.body.full_name || $.body.user.full_name)",
                              },
                          },
                          updated_me: {
                              template:
                                  "Updated Self,\nUser: %%user_full_name%% - %%user_username%% - \nhas updated hi profile",
                              variables: {
                                  user_id: "$.user.user_id",
                                  user_full_name: "$.user.full_name",
                                  user_username: "$.user.username",
                                  user_phone: "$.user.phone",
                                  user_email: "$.user.email",
                              },
                          },
                          created_user: {
                              template:
                                  "Created New User\nUser: %%user_full_name%% - %%user_username%% - \nhas created_new User with username %%new_user_username%% and full name %%new_user_full_name%%",
                              variables: {
                                  user_id: "$.user.user_id",
                                  user_full_name: "$.user.full_name",
                                  user_username: "$.user.username",
                                  user_phone: "$.user.phone",
                                  user_email: "$.user.email",
                                  new_user_username: "$.body.username",
                                  new_user_full_name: "$.body.full_name",
                              },
                          },
                          removed_user_file_from_archive: {
                              template:
                                  "Removed User File From Archive, User ID: %%user_id%%, User Full Name: %%user_name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  user_name: "$.body.user.full_name",
                              },
                          },
                          changed_notification_status: {
                              template: "Changed notification, Notification title: %%title%%, notification ID: %%id%%",
                              variables: {
                                  id: "$.body.notification.notification_id",
                                  title: "$.body.notification.title",
                              },
                          },
                          updated_general_settings: {
                              template: "Updated General Settings",
                              variables: {},
                          },
                          activated_user_profile: {
                              template:
                                  "Activated User Profile, User ID: %%user_id%%, Username: %%username%%, Name: %%name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  name: "$.body.user.full_name",
                                  username: "$.body.user.username",
                              },
                          },
                          archived_user_profile: {
                              template:
                                  "Archived User Profile, User ID: %%user_id%%, Username: %%username%%, Name: %%name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  name: "$.body.user.full_name",
                                  username: "$.body.user.username",
                              },
                          },
                          deleted_authorization_profile: {
                              template:
                                  "Deleted Authorization Profile, Profile Name: %%profile_name%%, Profile ID: %%profile_id%%",
                              variables: {
                                  profile_id: "$.body.profile.profile_id",
                                  profile_name: "$.body.profile.name",
                              },
                          },
                          created_authorization_profile: {
                              template:
                                  "Created Authorization Profile, Profile Name: %%profile_name%%, Profile ID: %%profile_id%%",
                              variables: {
                                  profile_id: "$.body.profile.profile_id",
                                  profile_name: "$.body.profile.name",
                              },
                          },
                          updated_authorization_profile: {
                              template:
                                  "Updated Authorization Profile, Profile Name: %%profile_name%%, Profile ID: %%profile_id%%",
                              variables: {
                                  profile_id: "$.body.profile.profile_id",
                                  profile_name: "$.body.profile.name",
                              },
                          },
                          updated_user_authorities: {
                              template:
                                  "Updated User Authorities, User ID: %%user_id%%, Username: %%username%%, Name: %%name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  name: "$.body.user.full_name",
                                  username: "$.body.user.username",
                              },
                          },
                          deactivated_user_profile: {
                              template:
                                  "Deactivated User Profile, User ID: %%user_id%%, Username: %%username%%, Name: %%name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  name: "$.body.user.full_name",
                                  username: "$.body.user.username",
                              },
                          },
                          deleted_user_profile: {
                              template:
                                  "Deleted User Profile, User ID: %%user_id%%, Username: %%username%%, Name: %%name%%",
                              variables: {
                                  user_id: "$.body.user.user_id",
                                  name: "$.body.user.full_name",
                                  username: "$.body.user.username",
                              },
                          },
                          published_notifications: {
                              template: "Published notification %%title%% with contents %%contents%%",
                              variables: {
                                  title: "$.title",
                                  contents: "$.contents",
                              },
                          },
                      },
                  },
              } as any);
    }

    env.unique_event_number = "__";

    fs.writeFileSync(path.join(dist_full_path, "server/env.json"), JSON.stringify(env, null, 4));
    fs.writeFileSync(path.join(dist_full_path, "server/env.default.json"), JSON.stringify(env, null, 4));
};

const clean_up_package_dot_json = (dist_full_path: string) => {
    const package_json = load_json(path.join(app_path, "package.json"));

    package_json.name = "project_name";
    package_json.version = "1.0.0";
    package_json.autho = "your name";

    fs.writeFileSync(path.join(dist_full_path, "package.json"), JSON.stringify(package_json, null, 4));
};
const create_command = (program: import("commander").Command) => {
    program
        .command("create_template")
        .argument("<dist>", "Destination of the template to be placed", (value, _) => {
            let absolute_dist_path = "";

            if (value.startsWith("/")) {
                absolute_dist_path = value;
            } else {
                if (value.match(/^\.\.?\//)) {
                    absolute_dist_path = path.join(process.cwd(), value);
                } else if (value.match(/^[a-z_]/i)) {
                    absolute_dist_path = path.join(app_path, "../", value);
                } else if (value.match(/^\~/)) {
                    absolute_dist_path = path.join(homedir(), value.replace("~/", ""));
                } else {
                    throw new Error(`Invalid distination path
the distination path must be one of the following options: 
- aboslute path (starts with \`/\`)
- relative path from the current directory 
- a path sibling to the curren project for example "template-test" will place the template in the same directory where the current project is placed                       
                        `);
                }
            }

            if (absolute_dist_path.startsWith(app_path)) {
                throw new Error(`
the dist path must be placed outside the current project                        
`);
            }

            const folder_exists = fs.existsSync(absolute_dist_path);
            if (folder_exists) {
                const stats = fs.statSync(absolute_dist_path);
                if (!stats.isDirectory()) {
                    throw new Error(`
Given Destination path already exists as a file!!                 
                    `);
                }
                const content = fs.readdirSync(absolute_dist_path);
                if (content.length) {
                    throw new Error(`
Destination Directory already exists and its not empty                    
                    `);
                }
            }

            console.log("abs dist", absolute_dist_path);
            return absolute_dist_path;
        })
        .alias("ct")
        .option("--minimal", "create minimal template", false)
        .option("--keep-all", "Dont remove anything", false)
        .option("--keep-package-info", "Dont remove package info", false)
        .option("--keep-routes", "Dont remove routes", false)
        .option("--keep-channels", "Dont remove channels", false)
        .option("--keep-tests", "Dont remove Test Files", false)
        .option("--keep-email-config", "Dont remove Email configuration", false)
        .option("--keep-modules", "Dont remove modules", false)
        .option("--keep-main-seeders", "Dont remove main seeders", false)
        .option("--keep-images", "Dont remove images", false)
        .option("--keep-dev-seeders", "Dont remove dev seeders", false)
        .option("--keep-static", "Dont remove static resources", false)
        .option("--keep-environment", "Dont clean up environment", false)
        .description("use it to run production build mode")
        .action(async (dist_path: string, options) => {
            if (options.keepRoutes || options.keepChannels) {
                options.keepModules = true;
            }
            const minimal = options.minimal;

            if (minimal) {
                for (const key in options) {
                    if (key.startsWith("keep")) {
                        options[key] = false;
                    }
                }
            }
            if (options.keepAll) {
                for (const key in options) {
                    if (key.startsWith("keep")) {
                        options[key] = true;
                    }
                }
            }

            const {
                keepModules,
                keepRoutes,
                keepChannels,
                keepEmailConfig,
                keepTests,
                // dont clean up env static files if true
                keepStatic,
                keepMainSeeders,
                keepImages,
                keepDevSeeders,
                keepEnvironment,
                keepPackageInfo,
            }: { [key: string]: boolean } = options;

            const included_relative_paths = [
                // prisma
                "prisma/migrations/migration_lock.toml",
                // assets
                "server/assets/images/.gitignore",
                // routers
                "server/routers/channels",
                !minimal && "server/routers/api_description",
                "server/routers/endpoints",
                !minimal && "server/routers/empty_route.ts",
                !minimal && "server/routers/status.router.ts",
                !minimal && "server/routers/dashboard/orm",
                !minimal && "server/routers/dashboard/user",
                !minimal && "server/routers/dashboard/user_type_access_x_app.middleware.ts",
                // channels
                "server/channels/echo.channel.ts",
                !minimal && "server/channels/dashboard/_0_x_app.middleware.ts",
                !minimal && "server/channels/dashboard/_1_operator.middleware.ts",
                !minimal && "server/channels/dashboard/_2_register_presencee.middleware.ts",
                !minimal && "server/channels/general_user_channels_state",
                !minimal && "server/channels/dashboard/presence/",
                !minimal && "server/channels/dashboard/messaging/",
                !minimal && "server/channels/dashboard/calling/",
                // modules
                !minimal && "server/modules/utils",
                !minimal && "server/modules/User",
                !minimal && "server/modules/Addressing",
                !minimal && "server/modules/index.ts",
                // statir resource middlewares
                !minimal && "server/middlewares/static_resources/private_files.ts",
                // main seeders
                !minimal && "server/startup/_0_seed/seeders/addresses.seeder.js",
                !minimal && "server/startup/_0_seed/seeders/customer.seeder.js",
                !minimal && "server/startup/_0_seed/seeders/super_admin.seeder.js",
                // static files
                !minimal && "server/static/.gitignore",
            ]
                .filter((e) => !!e)
                .map((p) => {
                    return path.join(app_path, p || "");
                });

            const excluded_relative_paths = [
                "dist/",
                "notes/",
                "number_of_files/list_of_files.txt",
                "number_of_files/list_of_files.txt",

                !keepEmailConfig && "server/email/email.conf.js",

                // prisma
                "prisma/main_schema.prisma",
                !keepModules && "prisma/migrations/",
                !keepModules && "prisma/client/",
                !keepModules && "prisma/scripts/",
                !keepModules && "server/modules",

                // assets
                !keepImages && "server/assets/images/",

                "server/assets/api_description_map.json",

                // jobs
                "server/jobs/handlers.test.ts",

                // main seeder
                !keepMainSeeders && "server/startup/_0_seed/seeders/",
                // dev seeders
                !keepDevSeeders && "server/startup/dev_seed/seeders/",

                // tests
                "test/",
                // locks
                "bun.lockb",
                "package-lock.json",
            ]
                .filter((e) => !!e)
                .map((p) => {
                    return path.join(app_path, p || "");
                });

            const instant_excluded_relative_paths = ["node_modules/", ".git/", "dist/"].map((p) => {
                return path.join(app_path, p);
            });

            if (minimal) {
                excluded_relative_paths.push(
                    ...[
                        "server/middlewares/",
                        "server/modules/",
                        "server/static/",
                        "server/startup/_0_seed/",
                        "server/startup/dev_seed/",
                    ].map((p) => {
                        return path.join(app_path, p);
                    }),
                );
            }

            if (!keepStatic) {
                excluded_relative_paths.push(path.join(app_path, "server/static/"));
                excluded_relative_paths.push(path.join(app_path, "server/middlewares/static_resources/"));
            }

            if (!keepRoutes) {
                excluded_relative_paths.push(path.join(app_path, "server/routers/"));
            }
            if (!keepChannels) {
                excluded_relative_paths.push(path.join(app_path, "server/channels/"));
            }

            const to_be_deleted = [] as string[];
            console.log("Copying Resources");
            fs.cpSync(app_path, dist_path, {
                recursive: true,
                preserveTimestamps: true,
                filter(source, destination) {
                    if (!keepTests && source.match(/\.test\.(?:ts|js)$/i)) {
                        console.log("ignoring test", source);
                        return false;
                    }
                    const excluded_match = excluded_relative_paths.find((p) => source.includes(p));
                    const included_match = included_relative_paths.find((p) => source.includes(p));

                    if (included_match) {
                        if (!excluded_match || excluded_match.length < included_match.length) {
                            return true;
                        }else{
                            console.log("skipping ", source)
                        }
                    }
                    if (instant_excluded_relative_paths.find((p) => source.includes(p))) {
                        return false;
                    }
                    if (
                        excluded_relative_paths.find((p) => source.includes(p)) &&
                        !included_relative_paths.find((p) => source.includes(p) || p.includes(source))
                    ) {
                        to_be_deleted.push(destination);
                        return true;
                    }

                    return true;
                },
            });

            console.log("Removing excess files");
            for (const delete_path of to_be_deleted) {
                if (fs.existsSync(delete_path)) {
                    fs.rmSync(delete_path, {
                        recursive: true,
                    });
                }
            }

            if (!keepModules) {
                // modify schema.prisma
                console.log("Cleaning up Schema");
                clean_up_schema(dist_path, options);

                // modify modules
                console.log("Cleaning up modules");
                !minimal && clean_up_modules(dist_path);
            }

            if (!keepMainSeeders) {
                // clean up main seeders index run file
                console.log("Cleaning up main seeder");
                !minimal && clean_up_main_seeder(dist_path);
            }

            if (!keepDevSeeders) {
                // clean up dev seeders index run file
                console.log("Cleaning up dev seeder");
                !minimal && clean_up_dev_seeder(dist_path);
            }

            if (!keepStatic) {
                // clean up .gitignore of /server/static/.gitignore
                console.log("Cleaning up static resources .gitignore");
                clean_up_git_ignore_file_of_static_resource(dist_path);
            }

            if (!keepEnvironment) {
                console.log("Cleaning up environment");
                clean_up_env(dist_path, options);
            }

            // clean up package.json
            if (!keepPackageInfo) {
                clean_up_package_dot_json(dist_path);
            }

            process.exit(0);
        });
};
export { create_command };

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                            },
                                        },
                                    },
                                    {
                                        name: 'prefixIds',
                                        params: {
                                            prefixIds: false,
                                            prefixClassNames: false,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: '*.js',
            },
        },
    },
};

export default nextConfig;

import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([
    {
        ...defaultOptions,
        input: "src/react-scenejs-timeline/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/react-scenejs-timeline/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
    },
]);


export default {
    output: {
        //...
        manualChunks: (moduleName) => {
            if (moduleName.includes('node_modules')) {
                return 'vendor'
            }

            if (moduleName.includes('modules/')) {
                return 'main'
            }
        }
    }
}
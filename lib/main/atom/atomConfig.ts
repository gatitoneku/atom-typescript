///ts:ref=globals
/// <reference path="../../globals.ts"/> ///ts:ref:generated

// Documentation https://atom.io/docs/api/v0.177.0/Config and http://json-schema.org/examples.html
// To add a new setting you need to add to
//    schema
//    getter/setter

var packageName = 'atom-typescript';
function getConfig<T>(name: string): T {
    return atom.config.get(packageName + '.' + name);
}

class Config {
    schema = {
        compileOnSave: {
            title: 'Compile on save',
            type: 'boolean',
            default: true
        }
    }
    get compileOnSave() { return getConfig<boolean>('compileOnSave') }
}
var config = new Config();
export = config;
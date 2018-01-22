class webpackConstNamePlugin {
  constructor(options) {
        
  }

    apply(compiler) {
      function setModuleConstant(expression, fn) {
        compiler.plugin('parser', function(parser) {
          parser.plugin(`expression ${ expression }`, function() {
            this.state.current.addVariable(expression, JSON.stringify(fn(this.state.module)))
            return true
          })
        })
      }
  
      setModuleConstant('__filename', function(module) {
        return module.resource
      });
  
      setModuleConstant('__dirname', function(module) {
        return module.context
      });
    }
  }

  module.exports = webpackConstNamePlugin;
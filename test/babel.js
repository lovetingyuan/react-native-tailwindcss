const babel = require('@babel/core')
const result = babel.transformSync(
  `
   function Dodo() {
    const aa = 34
    const Ddf = function kl() {
      return <div className="font-bold">aaa
      <span className={dfs}></span>
      </div>
    }
  }
  export default React.memo(function Dosddo() {
    const aa = 34
    const Ddf = () => {
      function Dod33do3() {
        const aa = 34
          return <div className="font-bold">aaa
          <span className={dfs}></span>
          </div>
      }
      return <div className="font-bold">aaa
      <span className={dfs}></span>
      </div>
    }
  })
`,
  {
    plugins: [require('../src/babel-plugin')],
    presets: ['@babel/preset-react'],
  }
)

console.log(result.code)

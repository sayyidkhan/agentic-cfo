import {build} from 'esbuild'
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
process.chdir(fileURLToPath(new URL('.',import.meta.url)))
const base=path.resolve('.')
const alias={'@inertiajs/react':path.join(base,'src/bridge.tsx'),'@adonisjs/inertia/react':path.join(base,'src/bridge.tsx'),'~/layouts/app':path.join(base,'src/Layout.tsx'),'~':path.resolve('../inertia'),'#services':path.resolve('../app/services')}
const demoCopy={name:'demo-copy',setup(build){build.onLoad({filter:/cfo-chat\.tsx$/},async({path:p})=>({contents:(await readFile(p,'utf8')).replace("Conversation history is stored in this app's SQLite database. When an AI provider is configured, your question and relevant financial figures are transmitted to that provider.","Demo chat history stays in this tab’s memory and disappears on reload. No financial records or questions are sent to an external AI provider. Guided mode is rules-based, not a generative AI model."),loader:'tsx'}))}}
const common={absWorkingDir:base,tsconfigRaw:{compilerOptions:{jsx:'react-jsx'}},plugins:[demoCopy],bundle:true,minify:true,jsx:'automatic',alias,nodePaths:[path.join(base,'node_modules')],logLevel:'info'}
const result=await build({...common,entryPoints:['src/client.tsx'],write:false,platform:'browser',target:'es2022',define:{'process.env.NODE_ENV':'"production"'}})
await writeFile('src/generated-client.js.txt',result.outputFiles[0].text)
const styles=await Promise.all(['../inertia/css/app.css','../inertia/css/cfo.css','src/style.css'].map(f=>readFile(f,'utf8')))
await writeFile('src/generated-style.css.txt',styles.join('\n'))
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true})
await build({...common,entryPoints:['src/server.ts'],outfile:'dist/server/index.js',platform:'browser',format:'esm',target:'es2022',loader:{'.txt':'text'}})
await copyFile('../.openai/hosting.json','.openai/hosting.json')
await copyFile('../.openai/hosting.json','dist/.openai/hosting.json')
const {cp}=await import('node:fs/promises')
await cp('dist','../dist',{recursive:true})
// Separate build for domain tests uses exactly the production module graph.
await build({...common,entryPoints:['src/domain.ts'],outfile:'dist/domain.mjs',platform:'node',format:'esm'})

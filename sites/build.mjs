import {build} from 'esbuild'
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
process.chdir(fileURLToPath(new URL('.',import.meta.url)))
const base=path.resolve('.')
const alias={'react':path.join(base,'node_modules/react'),'react-dom':path.join(base,'node_modules/react-dom'),'lucide-react':path.join(base,'node_modules/lucide-react'),'sonner':path.join(base,'node_modules/sonner'),'@inertiajs/react':path.join(base,'src/bridge.tsx'),'@adonisjs/inertia/react':path.join(base,'src/bridge.tsx'),'~/layouts/app':path.join(base,'src/Layout.tsx'),'~':path.resolve('../inertia'),'#services':path.resolve('../app/services')}
const demoCopy={name:'demo-copy',setup(build){build.onLoad({filter:/sandy_avatar\.tsx$/},async()=>({contents:await readFile('src/SandyAvatar.tsx','utf8'),loader:'tsx',resolveDir:path.join(base,'src')}));build.onLoad({filter:/cfo-chat\.tsx$/},async({path:p})=>({contents:(await readFile(p,'utf8')).replace("Conversation history is stored in this app's SQLite database. When an AI provider is configured, your question and relevant financial figures are transmitted to that provider.","In the public demo, chat stays in this tab’s memory and disappears on reload. When personal workspaces are enabled, chat is saved with your own account. No questions are sent to an external AI provider. Guided mode is rules-based, not a generative AI model."),loader:'tsx'}))}}
const common={absWorkingDir:base,tsconfigRaw:{compilerOptions:{jsx:'react-jsx'}},plugins:[demoCopy],bundle:true,minify:true,jsx:'automatic',alias,nodePaths:[path.join(base,'node_modules')],logLevel:'info'}
const result=await build({...common,entryPoints:['src/client.tsx'],write:false,platform:'browser',target:'es2022',define:{'process.env.NODE_ENV':'"production"'}})
await writeFile('src/generated-client.js.txt',result.outputFiles[0].text)
const styles=await Promise.all(['../inertia/css/app.css','../inertia/css/cfo.css','src/style.css'].map(f=>readFile(f,'utf8')))
await writeFile('src/generated-style.css.txt',styles.join('\n'))
const sandyArt=Object.fromEntries(await Promise.all(['curious','calm','watchful','concerned','screaming','celebrating','relieved','greeting'].map(async mood=>[mood,(await readFile('assets/sandy/'+mood+'.webp')).toString('base64')])));
await writeFile('src/generated-sandy-assets.txt',JSON.stringify(sandyArt))
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true})
await build({...common,entryPoints:['src/server.ts'],outfile:'dist/server/index.js',platform:'browser',format:'esm',target:'es2022',loader:{'.txt':'text'}})
await copyFile('../.openai/hosting.json','.openai/hosting.json')
await copyFile('../.openai/hosting.json','dist/.openai/hosting.json')
await mkdir('../dist/server',{recursive:true});await mkdir('../dist/.openai',{recursive:true})
await copyFile('dist/server/index.js','../dist/server/index.js')
await copyFile('dist/.openai/hosting.json','../dist/.openai/hosting.json')
// Separate build for domain tests uses exactly the production module graph.
await build({...common,entryPoints:['src/domain.ts'],outfile:'dist/domain.mjs',platform:'node',format:'esm'})

await build({...common,entryPoints:['src/sandy_blink.ts'],outfile:'dist/sandy-blink.mjs',platform:'node',format:'esm'})
await build({...common,entryPoints:['src/sandy_raster.ts'],outfile:'dist/sandy-raster.mjs',platform:'node',format:'esm'})
await build({...common,entryPoints:['src/sandy_motion.ts'],outfile:'dist/sandy-motion.mjs',platform:'node',format:'esm'})
await build({...common,entryPoints:['src/api.ts'],outfile:'dist/api.mjs',platform:'node',format:'esm'})
await build({...common,entryPoints:['src/routing.ts'],outfile:'dist/routing.mjs',platform:'node',format:'esm'})

const migrations=await Promise.all(['0000_financial_workspaces.sql','0001_storage_checks.sql'].map(async name=>({name,sql:await readFile('../drizzle/'+name,'utf8')})))
await writeFile('dist/preview-migrations.json',JSON.stringify(migrations))

await build({...common,entryPoints:['src/sandy_gpu.ts'],outfile:'dist/sandy-gpu.mjs',platform:'node',format:'esm'})

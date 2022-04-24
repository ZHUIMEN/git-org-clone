#!/usr/bin/env zx
// const token = ''

/**
 * 1、https://github.com/settings/apps 申请 Personal access tokens =>  repo => 全部 打勾
 * 2、curl to fetch  获取 token
 * curl -i -u userName:autho-toen "https://api.github.com/orgs/{org}/repos?per_page=100&page=1"
 * https://kigiri.github.io/fetch/
 * 3、复制 “Basic xxxxxxxx”  粘贴到 token
 *  
 */
const token = 'xxxx'
const org = argv.org;  
if(!token||token ==='xxxx'){
    exitWithError('请前往GitHub申请Authorization： https://github.com/settings/apps')
      
}
if(!org){
    exitWithError('请填写 ./git.mjs -org orgName')    
}
const data = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&type=all`,{
    method:'GET',
    headers:{
        Authorization:token,
        Accept:'application/vnd.github.v3+json'
    }
})
const urls = await data.json()
console.log(urls)
const repos = urls.filter(info=>{
    return !info.fork;    
})
.map(info=>({
    ssh_url:info.ssh_url,
    git_url:info.git_url,
    clone_url:info.clone_url,
    svn_url:info.svn_url,
    name:info.name,
}));

console.log('==============组织地址======================');
console.log(repos);
console.log('====================================');

await $`rm -rf backups_${org}`;

await $`mkdir backups_${org}`;

cd(`./backups_${org}`)

const cloneAllRemoteBranch = async (gitUrl,name)=>{
    // https://stackoverflow.com/questions/10312521/how-to-fetch-all-git-branches
    await $`git clone ${gitUrl}`
    cd(`./${name}`)
   const  branchLenth = await $`git branch -r | grep -v '\\->'` 
   if(branchLenth.stdout.split('\n').length>2){
    try{
        await $`git branch -r | grep -v "\\->" | while read remote; do git branch --track "\${remote#origin/}" "$remote"; done`
        await $`git fetch --all`;
        await $`git pull`
    }catch(e){
        console.error(e);
    }
   }
}

Promise.all(repos.map(item=>{
    return cloneAllRemoteBranch(item.ssh_url,item.name)
}))


function exitWithError(errorMessage) {
    console.error(chalk.red(errorMessage));
    process.exit(1);
  }
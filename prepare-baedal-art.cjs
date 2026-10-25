const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/Terry.J/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=__dirname, dest=path.join(root,'assets/baedal');
const grids={shops:[8,1,128],homes:[8,1,128],badges:[3,1,64],scooter:[4,2,128],upgrades:[4,1,256],stamps:[3,1,512],exhaust:[4,1,64],sparkles:[4,1,96]};
(async()=>{fs.mkdirSync(dest,{recursive:true});fs.mkdirSync(path.join(dest,'originals'),{recursive:true});
for(const a of JSON.parse(fs.readFileSync(path.join(root,'baedal-art-sources.json')))){
 const source=path.join(dest,'originals',a.name+'.png');fs.copyFileSync(a.path,source);
 if(grids[a.name]){const [cols,rows,size]=grids[a.name],m=await sharp(source).metadata();
  for(let i=0;i<cols*rows;i++){const x=i%cols,y=Math.floor(i/cols),left=Math.round(x*m.width/cols),top=Math.round(y*m.height/rows),right=Math.round((x+1)*m.width/cols),bottom=Math.round((y+1)*m.height/rows);
   const cell=await sharp(source).extract({left,top,width:right-left,height:bottom-top}).png().toBuffer();
   await sharp(cell).trim({threshold:12}).resize(size-12,size-12,{fit:'contain',background:'#00000000'}).extend({top:6,bottom:6,left:6,right:6,background:'#00000000'}).png().toFile(path.join(dest,`${a.name}-${i}.png`));
  }
 }else{const dims=a.name==='feature'?[1024,500]:a.name.startsWith('onboarding')?[800,600]:[1024,1024];await sharp(source).resize(...dims,{fit:'fill'}).png().toFile(path.join(dest,a.name+'.png'));}
}
for(const name of ['icon-a','icon-b','icon-c']){if(!fs.existsSync(path.join(dest,name+'.png')))continue;for(const size of [512,192,96,48])await sharp(path.join(dest,name+'.png')).resize(size,size).png().toFile(path.join(dest,`${name}-${size}.png`));}
console.log('Prepared',fs.readdirSync(dest).length,'assets');
})().catch(e=>{console.error(e);process.exit(1)});

const TOTAL=4;
cc.Class({
    extends: cc.Component,

    properties: {
        imagPref:cc.Sprite,
    },

    
    start () {
      //  this.setImag();
    },
    setImag(){
       let url="Img_1/"
       let a=Math.floor(Math.random()*TOTAL)+1;
      
       let url1=url+a;
      
    cc.loader.loadRes(url1, cc.SpriteFrame, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        this.imagPref.spriteFrame = res; //设置精灵组件图片资源
        this.number=a;
       
    });
    },

    getUrlA(){
        return this.number;
    },
    setImagUrl(url2){//url2为图片名字
        let url1="Img_1/"
        let url=url1+url2;
       
        cc.loader.loadRes(url, cc.SpriteFrame, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            this.imagPref.spriteFrame = res; //设置精灵组件图片资源
           
           
        });
    },
    
});

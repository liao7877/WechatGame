
cc.Class({
    extends: cc.Component,
    properties: {
       
        scene:"game",//要切换的场景
        //背景
        //Bg:{
        //	default:null,
        //	type:cc.Node
        //}
    },

    start () {
 
    },
    changeScene(){
 
        //切换场景
        cc.director.loadScene(this.scene);
    }

    // update (dt) {},
});

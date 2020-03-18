// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        panelPause: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init: function () {
        this.panelPause.active = false;
    },
    togglePause: function () {
        this.panelPause.active = !this.panelPause.active;
    },

    gamePause:function(){
        cc.director.pause();//暂停游戏
    },

    gameResume:function(){
        cc.director.resume();//继续游戏
    }

});

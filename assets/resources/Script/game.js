
const VETLENGTH=50;//触摸屏最短移动50个px
const BLOCKSIZE=150;//格子size
const BLOCKNUMBER=4;//
const MOVETIME=0.2;//移动时间
const DELTATIME=2;//得分增加的时间
cc.Class({
    extends: cc.Component,
    properties: {
        bg:cc.Node,//背景
        block_prefab:cc.Prefab,//预置节点
        score:0,//初始分数为0
        score_label:cc.Label,//分数
        end_time_label:cc.Label,//时间
        gameOverFlag:false,//游戏是否结束
        scoreAudio:{
            default:null,
            type:cc.AudioClip
        },
        wrongAudio:{
            default:null,
            type:cc.AudioClip
        },
        clock:{
            type:cc.Node,
            default:null,
        },
        minute:{
            type:cc.Node,
            default:null,
        },

    },

    start () {
        this.addEvenHander();
        this.init();
    },
    //划屏事件监听
    addEvenHander(){
        this.bg.on('touchstart',(event)=>{
            this.startPoint=event.getLocation();
        });
        this.bg.on('touchend',(event)=>{
            this.touchEnd(event);

        });
        this.bg.on('touchcancel',(event)=>{
            this.touchEnd(event);

        });


    },
    touchCancal(){

    },
    touchEnd(event){
        this.endPoint=event.getLocation();
            let vet=this.endPoint.sub(this.startPoint);
            if(vet.mag()>VETLENGTH){
                if(Math.abs(vet.x)>Math.abs(vet.y)){
                    if(vet.x>0){
                        
                        this.moveRight();
                    }else{
                        
                        this.moveLeft();
                    }
                }else{
                    if(vet.y>0){
                        this.moveUp();
                    }else{
                        this.moveDown();
                    }
                }
            }
    },
    //-------------------------------------------------------
    moveLeft(){
       cc.log('moveleft');
       this.Block_Rota(1);
    },
    moveRight(){
        cc.log('moveright');
        this.Block_Rota(2);
    },
    moveUp(){
        cc.log('moveUp');
        this.Block_Rota(3);
        
    },
    moveDown(){
       cc.log('movedown');
       this.Block_Rota(4);
    },
    //-----------------------------------------------------------
    //添加预置Box节点。
    addBrock(){
        let block=cc.instantiate(this.block_prefab);
        block.width=BLOCKSIZE;
        block.height=BLOCKSIZE;
        return block;
    },
    upDateScore(number){//计分
        this.score=number;
        this.score_label.string='分数:'+number;
    },
    endTime(){//计时
        let newtime=this.timeEnd--;
        this.end_time_label.string=newtime;
        if(newtime<0){
            this.gameOver();
            this.unschedule(endTime);
        }
    },
    init(){
        this.timeEnd=25;//结束时间
        this.blocks=[];//存储prefad
        this.positions=[];//存储位置
        this.number=[];//存储图片的名字,以数字命名0:中心图片,1:中心替换图片
        this.numbers=[1,2,3,4,5,6,7,8,9,10,11,12];
        this.initNumber=[];//number数组4*3
        this.positions[0]=cc.v2(0,0);//center
        this.minuteRotation();
        this.gameOverFlag=false;
        this.upDateScore(0); 
        let n=this.bgClockRotation();
        cc.log(n);
        for(let i=0;i<n;i++){
        	this.changeCircle(1);
        }
        cc.log(this.numbers);
        let bg_clock_action=cc.rotateBy(1.5,30*n);
        this.clock.runAction(bg_clock_action);
        this.addCentreBlock();
        this.schedule(this.endTime,1);
    },


    changeCircle(choice){//choice=1顺时针，=2逆时针
        if(choice==1){
            let numberS=[];
            numberS[0]=this.numbers[11];
            for(let i=1;i<this.numbers.length;++i){
                numberS[i]=this.numbers[i-1];
            }
            this.numbers=numberS;
            return true;
        }else if(choice==2){
            let numberS=[];
            for(let i=0;i<this.numbers.length-1;++i){
                numberS[i]=this.numbers[i+1];
            }
            numberS[11]=this.numbers[0];
            this.numbers=numberS;
            return true;
        }else{
            return false;
        }
    },

    initChangCircle(){//算出节点的位置
        for(let i=0;i<3;i++){
            this.initNumber.push([0,0,0,0]);
            for(let j=0;j<BLOCKNUMBER;j++){
                this.initNumber[i ][j]=this.numbers[i+j*3];
            }
        }
    },

    bgClockRotation(){
        var testDate = new Date();
        var deltaAngle=0;//旋转角度
        let Hour=testDate.getHours();//获取当前小时数
        if(Hour%2!=0){
            deltaAngle=360-30*(Hour+1)/2;//如果获取的当前小时数为奇数，则用此函数变换
        }
        else{
            deltaAngle=360-30*Hour/2;//若为偶数，则直接除以2再乘以30度
        }
      return deltaAngle/30;
     },

    addCentreBlock(){
        //中心节点
        this.initChangCircle();
        let blockCenter=Math.floor(Math.random()*BLOCKNUMBER);
        this.blocks[0]=this.addBrock();
        let numberb=this.initNumber[0][blockCenter];
        this.number[0]=numberb;
        this.bg.addChild(this.blocks[0]);//
        this.blocks[0].setPosition(this.positions[0]);
        this.blocks[0].getComponent('block_img_change').setImagUrl(numberb);
        this.setImagUrl(numberb);
    },

   addNewReplaceBlocks(choice){//生成替换节点下标，
    let block_replace=Math.floor(Math.random()*BLOCKNUMBER);
    if(choice==1){
        this.changeCircle(1);
        this.initChangCircle();
        let numberb=this.initNumber[0][block_replace];
        this.number[1]=numberb;
        this.changeCircle(2);
        return numberb;
    }else if(choice==2){
        this.changeCircle(2);
        this.initChangCircle();
        let numberb=this.initNumber[0][block_replace];
        this.number[1]=numberb;
        this.changeCircle(1);
        return numberb;
    }else{
        return false;
    }
   },
   minuteRotation(){
    let bg_minute_action=cc.rotateBy(this.timeEnd,-(360*this.timeEnd)/12);
    this.minute.runAction(bg_minute_action);
   },
   setImagUrl(url2){//url2为图片名字
    let url1="Img_2/"
    let url=url1+url2+'.jpg';
   
    cc.loader.loadRes(url, cc.SpriteFrame, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
       this.fuirt.spriteFrame = res; //设置精灵组件图片资源
       
       
    });
},

   //游戏逻辑部分，图片生成和旋转，播放音效和得分计时
    Block_Rota(choice){//旋转
    if(choice==1){//left
        if(this.isRotation(choice)){
            let numberb=this.addNewReplaceBlocks(1);//替换中心节点 
            let center_block_replace=this.addBrock();//中心替换节点
            center_block_replace.getComponent('block_img_change').setImagUrl(this.number[1]);
            this.bg.addChild(center_block_replace);
            center_block_replace.scaleX=0; 
            center_block_replace.setPosition(cc.v2(BLOCKSIZE/2,0));
            let spawn = cc.spawn(cc.moveBy(MOVETIME, -(BLOCKSIZE/2),0), cc.scaleTo(MOVETIME, 0, 1));
            let sspawn = cc.spawn(cc.moveBy(MOVETIME, -(BLOCKSIZE/2),0), cc.scaleTo(MOVETIME, 1, 1));
            let bg_clock_action=cc.rotateBy(MOVETIME,30);
            let bg_minute_action=cc.rotateBy(MOVETIME*1.5,360);
            let bg_minute_action1=cc.rotateBy(this.timeEnd,-(360*this.timeEnd)/12);
            let seq=cc.sequence(bg_minute_action,bg_minute_action1);
            this.minute.stopAllActions();
            this.minute.runAction(seq);
            this.clock.runAction(bg_clock_action);
            this.blocks[0].runAction(spawn);
            center_block_replace.runAction(sspawn);
           
            this.number[0]=numberb;
            this.blocks[0]=center_block_replace;
            this.changeCircle(1);
            this.initChangCircle();
            this.setImagUrl(numberb);
           // this.blocks[1].getComponent('block_img_change').setImagUrl(this.number[1]);
            cc.audioEngine.playEffect(this.scoreAudio, false);//播放得分音效
            this.upDateScore(this.score+1);
            this.timeEnd+=DELTATIME;

            return true;
        }
        else{
            this.timeEnd-=2*DELTATIME;
            cc.audioEngine.playEffect(this.wrongAudio, false);//播放错误音效
            return false;
        }
        
    }
    else if(choice==2){//right
        if(this.isRotation(choice)){
           
            let numberb=this.addNewReplaceBlocks(1);//替换中心节点
            let center_block_replace=this.addBrock();//中心替换节点
            center_block_replace.getComponent('block_img_change').setImagUrl(this.number[1]);
            this.bg.addChild(center_block_replace);
            center_block_replace.scaleX=0; 
            center_block_replace.setPosition(cc.v2(-BLOCKSIZE/2,0));
            let spawn = cc.spawn(cc.moveBy(MOVETIME, (BLOCKSIZE/2),0), cc.scaleTo(MOVETIME, 0, 1));
            let spawn1 = cc.spawn(cc.moveBy(MOVETIME,(BLOCKSIZE/2),0), cc.scaleTo(MOVETIME, 1, 1));
            let bg_clock_action=cc.rotateBy(MOVETIME,30);
            let bg_minute_action=cc.rotateBy(MOVETIME*1.5,360);
            let bg_minute_action1=cc.rotateBy(this.timeEnd,-(360*this.timeEnd)/12);
            let seq=cc.sequence(bg_minute_action,bg_minute_action1);
            this.minute.stopAllActions();
            this.minute.runAction(seq);
            this.clock.runAction(bg_clock_action); 
            this.blocks[0].runAction(spawn);
            center_block_replace.runAction(spawn1);
            this.number[0]=numberb;
            this.blocks[0]=center_block_replace;
            this.changeCircle(1);
            this.initChangCircle();
            this.setImagUrl(numberb);
          //  this.blocks[0].getComponent('block_img_change').setImagUrl(this.number[0]);
            cc.audioEngine.playEffect(this.scoreAudio, false);//播放得分音效
            this.upDateScore(this.score+1);
            this.timeEnd+=DELTATIME;
            return true;
        }
        else{
            this.timeEnd-=2*DELTATIME;
            cc.audioEngine.playEffect(this.wrongAudio, false);//播放错误音效
            return false;
        }
    }
    else if(choice==3){//up
        if(this.isRotation(choice)){
            let numberb=this.addNewReplaceBlocks(2);//替换中心节点
            let center_block_replace=this.addBrock();//中心替换节点
            center_block_replace.getComponent('block_img_change').setImagUrl(this.number[1]);
            this.bg.addChild(center_block_replace);
            center_block_replace.scaleY=0; 
            center_block_replace.setPosition(cc.v2(0,-BLOCKSIZE/2));
            let spawn = cc.spawn(cc.moveBy(MOVETIME, 0,(BLOCKSIZE/2)), cc.scaleTo(MOVETIME, 1, 0));
            let spawn1 = cc.spawn(cc.moveBy(MOVETIME,0,(BLOCKSIZE/2)), cc.scaleTo(MOVETIME, 1, 1));
            let bg_clock_action=cc.rotateBy(MOVETIME,-30);
            let bg_minute_action=cc.rotateBy(MOVETIME*1.5,360);
            let bg_minute_action1=cc.rotateBy(this.timeEnd,-(360*this.timeEnd)/12);
            let seq=cc.sequence(bg_minute_action,bg_minute_action1);
            this.minute.stopAllActions();
            this.minute.runAction(seq);
            this.clock.runAction(bg_clock_action); 
            this.blocks[0].runAction(spawn);
            center_block_replace.runAction(spawn1);
            this.number[0]=numberb;
            this.blocks[0]=center_block_replace;
            this.changeCircle(2);
            this.initChangCircle();
            this.setImagUrl(numberb);
           // this.blocks[2].getComponent('block_img_change').setImagUrl(this.number[2]);
            cc.audioEngine.playEffect(this.scoreAudio, false);//播放得分音效
            this.upDateScore(this.score+1);
            this.timeEnd+=DELTATIME;
            return true;
        }
        else{
            this.timeEnd-=2*DELTATIME;
            cc.audioEngine.playEffect(this.wrongAudio, false);//播放错误音效
            return false;
        }
    }
    else if(choice==4){//dowm
        if(this.isRotation(choice)){
            let numberb=this.addNewReplaceBlocks(2);//替换中心节点
            let center_block_replace=this.addBrock();//中心替换节点
            center_block_replace.getComponent('block_img_change').setImagUrl(this.number[1]);
            this.bg.addChild(center_block_replace);
            center_block_replace.scaleY=0; 
            center_block_replace.setPosition(cc.v2(0,BLOCKSIZE/2));
            let spawn = cc.spawn(cc.moveBy(MOVETIME, 0,-(BLOCKSIZE/2)), cc.scaleTo(MOVETIME, 1, 0));
            let spawn1 = cc.spawn(cc.moveBy(MOVETIME,0,-(BLOCKSIZE/2)), cc.scaleTo(MOVETIME, 1, 1));
            let bg_clock_action=cc.rotateBy(MOVETIME,-30);
            let bg_minute_action=cc.rotateBy(MOVETIME*1.5,360);
            let bg_minute_action1=cc.rotateBy(this.timeEnd,-(360*this.timeEnd)/12);
            let seq=cc.sequence(bg_minute_action,bg_minute_action1);
            this.minute.stopAllActions();
            this.minute.runAction(seq);
            this.clock.runAction(bg_clock_action);
            this.blocks[0].runAction(spawn);
            center_block_replace.runAction(spawn1);
            this.number[0]=numberb;
            this.blocks[0]=center_block_replace;
            this.changeCircle(2);
            this.initChangCircle();
            this.setImagUrl(numberb);
           // this.blocks[3].getComponent('block_img_change').setImagUrl(this.number[3]);
            cc.audioEngine.playEffect(this.scoreAudio, false);//播放得分音效
            this.upDateScore(this.score+1);
            this.timeEnd+=DELTATIME;
            return true;
        }
        else{
            this.timeEnd-=2*DELTATIME;
            cc.audioEngine.playEffect(this.wrongAudio, false);//播放错误音效
            return false;
        }
    }else{
        return false;
    }   
    },
    gameOver(){
        cc.director.loadScene('end');
    },
    isRotation(choice){//判断图片是否一致
        this.initChangCircle();
        if(choice==1){//left
            if(this.number[0]==this.initNumber[0][3]){
                return true;
            }else{
                return false;
            }
        }else if(choice==2){//right
            if(this.number[0]==this.initNumber[0][1]){
                return true;
            }else{
                return false;
            }
        }else if(choice==3){//up
            if(this.number[0]==this.initNumber[0][0]){
                return true;
            }else{
                return false;
            }
        }else if(choice==4){//dowm
            if(this.number[0]==this.initNumber[0][2]){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }
    // update (dt) {},
});

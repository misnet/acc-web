/**
 * 颜色圆块
 */
import { PureComponent } from "react";
import { CheckOutlined } from '@ant-design/icons';
import className from 'classnames';
import styles from './index.less';

class ColorItem extends PureComponent{
    static defaultProps = {
        value:"",
        color:[],
        selected:false,
        white:false,
        onSelect:()=>{}
    }
    createColor=(v,index)=>{
        let styleValue = {};
        if(v.width){
            if(v.width<1){
                styleValue['width'] = v.width * 100 +'%';
            }else{
                styleValue['width'] = '100%';
            }
        }
        if(v.color){
            styleValue['backgroundColor'] = v.color;
        }
        if(v.image){
            styleValue['backgroundImage'] = v.image;
            styleValue['backgroundRepeat'] = 'no-repeat';
            styleValue['backgroundSize'] = '100%';
        }
        return (
            <div style={styleValue} key={'color-'+index}></div>
        )
    }
    selectColor=(v)=>{
        this.props.onSelect(v);
    }
    render(){
        return (
            <div className={className(styles.colorItem,this.props.selected?styles.selected:{},this.props.white?styles.white:{})} onClick={()=>{this.selectColor(this.props.value)}}>
                {this.props.color.map((v,index)=>{
                    let v2 = {...v};
                    if(v2.width===undefined){
                        v2.width = 1 / Math.min(this.props.color.length,4);
                    }
                    return this.createColor(v2,index);
                })}
                {this.props.selected?<CheckOutlined />:null}
            </div>
        );
    }
}
export default ColorItem;
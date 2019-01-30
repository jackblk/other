function bindechexMain(){this.version='0.78';w=500;this.binTypes=["number","0001","signed 8-bit","signed 16-bit","signed 32-bit"];var s='';s+='<div style="position: relative; max-width: '+w+'px; margin: auto; border-radius: 10px; background-color: #ddeeff;">';s+='<div style="text-align: center; padding:6px;">';s+='Binary type:&nbsp;';this.binTypes=["number","0001","signed 8-bit","signed 16-bit","signed 32-bit"];s+=getDropdownHTML(this.binTypes,'go(-1)','bintype');s+='</div>';this.flds=[['Binary','blue'],['Decimal','darkblue'],['Hexadecimal','green']];s+='<div style="line-height: 32px;">';for(var i=0;i<3;i++){s+='<div style="width: 120px; float:left; text-align: right; vertical-align: top; ">';s+='<span style="font: bold 16px Arial; color: '+this.flds[i][1]+'; ">'+this.flds[i][0]+': &nbsp;</span>';s+='</div>';s+='<div style="overflow:hidden; width:auto;text-align: left; ">';s+='<textarea id="text'+i+'" style="width: 90%; height: 52px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: '+this.flds[i][1]+'; background-color: #eeffee; " value="" onKeyUp="go('+i+')"></textarea>';if(i==1){s+='<div style="display: inline-block; width: 6%;">';s+='<button onclick="numAdd(1)" style="font: 22px Arial;" class="togglebtn" >+</button>';s+='<button onclick="numAdd(-1)" style="font: 22px Arial;" class="togglebtn" >&minus;</button>';s+='</div>';}
s+='</div>';}
s+='</div>';s+='<div style="line-height: 20px;">&nbsp;</div>';s+='<div id="copyrt" style="position: absolute; left: 5px; bottom: 3px; font: 10px Arial; color: #6600cc; ">&copy; 2017 MathsIsFun.com  v'+this.version+'</div>';s+='</div>';document.write(s);this.hexArray=[0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];this.binArray=["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111"];this.enterKey=String.fromCharCode(13);this.lastFldNum=0;go(this.lastFldNum);}
function numAdd(v){var div=document.getElementById('text'+1);var val=div.value;var n=new Num('');var s=n.fullAdd(val,v.toString());div.value=s;go(1);}
function getRuleQ(){return true;}
function go(n){if(n<0)n=this.lastFldNum;this.lastFldNum=n;var divs=[];var vals=[];for(var i=0;i<3;i++){var div=document.getElementById('text'+i);divs.push(div);var val=div.value;vals.push(val);if(val==0)val='';div.value=val;}
switch(n){case 0:vals[0]=vals[0].replace(/[^01\-\.]+/g,'');divs[0].value=cleanNum(vals[0],"bin");divs[1].value=bin2Dec(vals[0]);divs[2].value=bin2Hex(vals[0]);break;case 1:vals[1]=vals[1].replace(/[^0-9e\-\.]+/g,'');divs[1].value=cleanNum(vals[1],"dec");divs[0].value=cleanBin(toBase(vals[1],2,60));divs[2].value=bin2Hex(divs[0].value);break;case 2:vals[2]=vals[2].replace(/[^0-9A-Fa-f\-\.]+/g,'');divs[2].value=cleanNum(vals[2],"hex");divs[0].value=hex2Bin(divs[2].value);divs[1].value=bin2Dec(divs[0].value);break;default:}}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" onclick="'+funcName+'" style="font: 16px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 2px;line-height:30px; border-radius:10px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==99?'checked':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:21px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function getBinType(){var el=document.getElementById('bintype');if(el.selectedIndex==-1)
return null;var t=el.options[el.selectedIndex].text;for(var i=0;i<this.binTypes.length;i++){if(this.binTypes[i]==t){return this.binTypes[i];}}
return '';}
function test(){var testGroups;testGroups=[["0",".","-0.1","-1000.0001"],["0",".","0.99999999999999999","1e4","10000","1.1","-1000.0001"],["0",".","F.FFF","-.a","0"]];for(var i=0;i<3;i++){console.log("TEST GROUP "+i);var tests=testGroups[i];for(var j=0;j<tests.length;j++){var div=document.getElementById('text'+i);div.value=tests[j];go(i);}}}
function cleanBin(binStr){var s="";switch(getBinType()){case "number":if(binStr=='0'){s=binStr;}else{s=binStr.replace(/^0+/,'');}
break;case "0001":s=leadZeros(binStr);break;case "signed 8-bit":s=nBitClean(binStr,8);break;case "signed 16-bit":s=nBitClean(binStr,16);break;case "signed 32-bit":s=nBitClean(binStr,32);break;default:}
return s;}
function nBit2Dec(binStr,bitlen){var n=new Num(binStr);var s;var whl=n.getWholeStr();if(whl.length==0)
whl="0";if(whl.length>bitlen){return "";}
var dec=n.getDecStr();var signStr="";if(whl.length==bitlen){if(whl.charAt(0)=="1"){signStr="-";whl=complement(whl);if(n.dec<=0)whl=binPlus1(whl);dec=complement(dec);dec=binPlus1(dec);}}
s=whl;if(!(n.dec<=0))s+="."+dec;s=fromBase(s,2);s=signStr+s;if(s.indexOf(".")>0){s=s.replace(/0+$/,'');}
return s;}
function nBitClean(binStr,bitlen){var n=new Num(binStr);var s;var whl=n.getWholeStr();if(whl.length==0)
whl="0";if(whl.length>bitlen-1){if(whl=="1"+"0".repeat(bitlen-1)&&(n.dec<=0)&&n.sign==-1){return whl;}else{return "";}}
whl=padLeft(whl,bitlen,"0");if(n.sign==-1){whl=complement(whl);if(n.dec<=0)whl=binPlus1(whl);}
s=whl;var dec=n.getDecStr();if(dec.length>0){if(n.sign==-1){dec=complement(dec);dec=binPlus1(dec);}
s+=".";s+=dec;}
return s;}
function complement(s){var s1="";for(var i=0;i<s.length;i++){if(s.charAt(i)=="0"){s1+="1";}else{s1+="0";}}
return s1;}
function binPlus1(s){var s1="";var col=s.length-1;var doneQ=false;do{if(doneQ){s1=s.charAt(col)+s1;}else{if(s.charAt(col)=="0"){s1="1"+s1;doneQ=true;}else{s1="0"+s1;}}
col--;}while(col>=0);return s1;}
function leadZeros(binStr){var n=new Num(binStr);var s=n.getSignStr();var whl=n.getWholeStr();if(whl.length==0)
whl="0";s+="0".repeat(Math.ceil(whl.length/4)*4-whl.length);s+=whl;var dec=n.getDecStr();if(dec.length>0){s+=".";s+=dec;s+="0".repeat(Math.ceil(dec.length/4)*4-dec.length);}
return s;}
function cleanNum(s,type){s=s.replace(this.enterKey,'');var n=s.indexOf(".");if(n>=0){s=s.substr(0,n+1)+s.substr(n+1).split(".").join("");}
if(type=="bin"||type=="hex"){if(fixedLenQ()){s=s.replace("-","");}}
return s;}
function fromBase(numStr,base){var fullNum=new Num(numStr,base);return fullNum.fmt();}
function toBase(numStr,base,places){var fullNum=new Num(numStr);return fullNum.toBase(base,places);}
function hex2Bin(numStr){var s="";var numParts=numStr.split(".");var numWhole=numParts[0];var sign="";if(numWhole.substr(0,1)=="-"){sign="-";numWhole=numWhole.substr(1);}
while(numWhole.length>0){var digit=numWhole.substr(0,1);digit=parseInt(digit,16).toString();numWhole=numWhole.substr(1);s+=this.binArray[digit];}
if(!fixedLenQ){s=s.replace(/^0+/,'');if(s.length==0)
s="0";}
if(numParts.length>1){var numFrac=numParts[1];s+=".";while(numFrac.length>0){digit=numFrac.substr(0,1);digit=parseInt(digit,16).toString();numFrac=numFrac.substr(1);s+=this.binArray[digit];}
s=s.replace(/0+$/,'');}
s=sign+s;if(s=="-"){s="0";}
if(s.substr(0,1)=="."){s="0"+s;}
if(s.substr(0,2)=="-."){s="-0."+s.substr(2);}
return(s);}
function bin2Dec(numStr){var s="";switch(getBinType()){case "number":s=fromBase(numStr,2);break;case "0001":s=fromBase(numStr,2);break;case "signed 8-bit":s=nBit2Dec(numStr,8);break;case "signed 16-bit":s=nBit2Dec(numStr,16);break;case "signed 32-bit":s=nBit2Dec(numStr,32);break;default:}
return s;}
function bin2Hex(numStr){if(numStr=="")
return "";var s="";var numParts=numStr.split(".");var numWhole=numParts[0];var sign="";if(numWhole.substr(0,1)=="-"){sign="-";numWhole=numWhole.substr(1);}
while(numWhole.length%4!=0){numWhole='0'+numWhole;}
while(numWhole.length>0){var digit=numWhole.substr(0,4);numWhole=numWhole.substr(4);for(var i=0;i<16;i++){if(digit==this.binArray[i]){s+=this.hexArray[i];}}}
if(!fixedLenQ()){s=s.replace(/^0+/,'');if(s.length==0)
s="0";}
if(numParts.length>1){var numFrac=numParts[1];s+=".";while(numFrac.length%4!=0){numFrac=numFrac+'0';}
while(numFrac.length>0){digit=numFrac.substr(0,4);numFrac=numFrac.substr(4);for(i=0;i<16;i++){if(digit==this.binArray[i]){s+=this.hexArray[i];}}}
s=s.replace(/0+$/,'');}
s=sign+s;if(s=="-"){s="0";}
if(s.substr(0,1)=="."){s="0"+s;}
if(s.substr(0,2)=="-."){s="-0."+s.substr(2);}
return(s);}
function fixedLenQ(){switch(getBinType()){case "signed 8-bit":case "signed 16-bit":case "signed 32-bit":return true;break;default:return false;}}
function Num(s,base){s=typeof s!=='undefined'?s:'';base=typeof base!=='undefined'?base:10;this.sign=1;this.digits="";this.dec=0;this.MAXDEC=20;this.baseDigits="0123456789ABCDEFGHJKLMNP";this.setNum(s,base);}
Num.prototype.setNum=function(s,base){base=typeof base!=='undefined'?base:10;if(s==0){this.digits='0';return;}
if(base==10){var digits=s;if(digits.charAt(0)=="-"){this.sign=-1;digits=digits.substring(1);}else{this.sign=1;}
var eVal=0;var ePos=digits.indexOf("e");if(ePos>=0){eVal=(digits.substr(ePos+1))>>0;digits=digits.substr(0,ePos);}
this.dec=digits.length-(digits.indexOf(".")+1);if(this.dec==digits.length){this.dec=0;}
this.dec-=eVal;digits=digits.split(".").join("");digits=digits.replace(/^0+/,'');if(digits.length==0){this.sign=1;}else{var s1="";for(var i=0;i<digits.length;i++){var digit=digits.charAt(i);if(this.baseDigits.indexOf(digit)>=0){s1+=digit;}}
digits=s1;}
this.digits=digits;}else{this.setFromBase(s,base);}};Num.prototype.setFromBase=function(numStr,base){var srcSign="";if(numStr.charAt(0)=="-"){srcSign="-";numStr=numStr.substring(1);}
var baseDec=numStr.length-(numStr.indexOf(".")+1);if(baseDec==numStr.length){baseDec=0;}
numStr=numStr.split(".").join("");numStr=numStr.replace(/^0+/,'');if(numStr.length==0){this.setNum("0");}else{var i=0;var len=numStr.length;var baseStr=base.toString();var digit=this.baseDigits.indexOf(numStr.charAt(i++).toUpperCase()).toString();var result=digit;while(i<len){digit=this.baseDigits.indexOf(numStr.charAt(i++).toUpperCase()).toString();result=this.fullMultiply(result,baseStr);result=this.fullAdd(result,digit);}
if(baseDec>0){var divBy=this.fullPower(baseStr,baseDec);result=this.fullDivide(result,divBy,this.MAXDEC);}
this.setNum(srcSign+result);}};Num.prototype.toBase=function(base,places){var parts=this.splitWholeFrac();var s=this.fullBaseWhole(parts[0],base);if(parts[1].length>0){s+="."+this.fullBaseFrac(parts[1],base,places);}
if(this.sign==-1){if(s!="0"){s="-"+s;}}
return s;};Num.prototype.abs=function(){var ansNum=this.clone();ansNum.sign=1;return ansNum;};Num.prototype.mult10=function(n){var xNew=this.clone();xNew.dec=xNew.dec-n;if(xNew.dec<0){xNew.digits=xNew.digits+"0".repeat(-xNew.dec);xNew.dec=0;}
return xNew;};Num.prototype.clone=function(){var ansNum=new Num();ansNum.digits=this.digits;ansNum.dec=this.dec;ansNum.sign=this.sign;return ansNum;};Num.prototype.fullMultiply=function(x,y){return this.multNums(new Num(x),new Num(y)).fmt();};Num.prototype.multNums=function(xNum,yNum){var N1=xNum.digits;var N2=yNum.digits;var ans="0";for(var i=N1.length-1;i>=0;i--){ans=this.fullAdd(ans,(this.fullMultiply1(N2,N1.charAt(i))+"0".repeat(N1.length-i-1)));}
var ansNum=new Num(ans);ansNum.dec=xNum.dec+yNum.dec;ansNum.sign=xNum.sign*yNum.sign;return ansNum;};Num.prototype.fullMultiply1=function(x,y1){var carry="0";var ans="";for(var i=x.length-1;i>(-1);i--){var product=((x.charAt(i))>>0)*(y1>>0)+(carry>>0);var prodStr=product.toString();if(product<10){prodStr="0"+prodStr;}
carry=prodStr.charAt(0);ans=prodStr.charAt(1)+ans;}
if(carry!="0"){ans=carry+ans;}
return ans;};Num.prototype.fullAdd=function(x,y){return this.addNums(new Num(x),new Num(y)).fmt();};Num.prototype.addNums=function(xNum,yNum){var ansNum=new Num();if(xNum.sign*yNum.sign==-1){ansNum=this.subNums(xNum.abs(),yNum.abs());if(xNum.sign==-1){ansNum.sign*=-1;}
return ansNum;}
var maxdec=Math.max(xNum.dec,yNum.dec);var xdig=xNum.digits+"0".repeat(maxdec-xNum.dec);var ydig=yNum.digits+"0".repeat(maxdec-yNum.dec);var maxlen=Math.max(xdig.length,ydig.length);xdig="0".repeat(maxlen-xdig.length)+xdig;ydig="0".repeat(maxlen-ydig.length)+ydig;var ans="";var carry=0;for(var i=xdig.length-1;i>=0;i--){var temp=((xdig.charAt(i))>>0)+((ydig.charAt(i))>>0)+carry;if((temp>=0)&&(temp<20)){if(temp>9){carry=1;ans=temp-10+ans;}else{carry=0;ans=temp+ans;}}}
if(carry==1){ans="1"+ans;}
ansNum.setNum(ans);ansNum.sign=xNum.sign;ansNum.dec=maxdec;return ansNum;};Num.prototype.fullPower=function(x,n){return this.expNums(new Num(x),n).fmt();};Num.prototype.expNums=function(xNum,nInt){var n=nInt;var b2pow=0;while((n&1)==0){b2pow++;n>>=1;}
var x=xNum.digits;var r=x;while((n>>=1)>0){x=this.fullMultiply(x,x);if((n&1)!=0){r=this.fullMultiply(r,x);}}
while(b2pow-->0){r=this.fullMultiply(r,r);}
var ansNum=new Num(r);ansNum.dec=xNum.dec*nInt;return ansNum;};Num.prototype.div=function(num,decimals){return this.divNums(this,num,decimals);};Num.prototype.fullDivide=function(x,y,decimals){return this.divNums(new Num(x),new Num(y),decimals).fmt();};Num.prototype.divNums=function(xNum,yNum,decimals){decimals=typeof decimals!=='undefined'?decimals:this.MAXDEC;if(xNum.digits.length==0){return new Num("0");}
if(yNum.digits.length==0){return new Num("0");}
var xDec=xNum.mult10(decimals);var maxdec=Math.max(xDec.dec,yNum.dec);var xdig=xDec.digits+"0".repeat(maxdec-xDec.dec);var ydig=yNum.digits+"0".repeat(maxdec-yNum.dec);if(this.compareDigits(xdig,"0")==0){return new Num("0");}
if(this.compareDigits(ydig,"0")==0){return new Num("0");}
var timestable=new Array(10);for(var i=0;i<10;i++){timestable[i]=this.fullMultiply(ydig,i.toString());}
var ans="0";var xNew=xdig;while(this.compareDigits(xNew,ydig)>=0){var col=1;while(this.compareDigits(xNew.substring(0,col),ydig)<0){col++;}
var xCurr=xNew.substring(0,col);var mult=9;while(this.compareDigits(timestable[mult],xCurr)>0){mult--;}
var fullmult=mult+""+"0".repeat(xNew.length-xCurr.length);ans=this.fullAdd(ans,fullmult);xNew=this.fullSubtract(xNew,this.fullMultiply(ydig,fullmult));}
var ansNum=new Num(ans);ansNum.dec=decimals;ansNum.sign=xNum.sign*yNum.sign;return ansNum;};Num.prototype.sub=function(num){return this.subNums(this,num);};Num.prototype.fullSubtract=function(x,y){return this.subNums(new Num(x),new Num(y)).fmt();};Num.prototype.subNums=function(xNum,yNum){var ansNum=new Num();if(xNum.sign*yNum.sign==-1){ansNum=xNum.abs().add(yNum.abs());if(xNum.sign==-1){ansNum.sign*=-1;}
return ansNum;}
var maxdec=Math.max(xNum.dec,yNum.dec);var xdig=xNum.digits+"0".repeat(maxdec-xNum.dec);var ydig=yNum.digits+"0".repeat(maxdec-yNum.dec);var maxlen=Math.max(xdig.length,ydig.length);xdig="0".repeat(maxlen-xdig.length)+xdig;ydig="0".repeat(maxlen-ydig.length)+ydig;var sign=this.compareDigits(xdig,ydig);if(sign==0){return new Num("0");}
if(sign==-1){var temp=xdig;xdig=ydig;ydig=temp;}
var ans="";var isborrow=0;for(var i=xdig.length-1;i>=0;i--){var xPiece=(xdig.charAt(i))>>0;var yPiece=(ydig.charAt(i))>>0;if(isborrow==1){isborrow=0;xPiece=xPiece-1;}
if(xPiece<0){xPiece=9;isborrow=1;}
if(xPiece<yPiece){xPiece=xPiece+10;isborrow=1;}
ans=(xPiece-yPiece)+ans;}
ansNum.setNum(ans);ansNum.sign=sign*xNum.sign;ansNum.dec=maxdec;return ansNum;};Num.prototype.fmt=function(sigDigits,eStt){sigDigits=typeof sigDigits!=='undefined'?sigDigits:0;eStt=typeof eStt!=='undefined'?eStt:0;var decWas=this.dec;var digitsWas=this.digits;if(sigDigits>this.digits.length){this.dec+=sigDigits-this.digits.length;this.digits+=strRepeat("0",sigDigits-this.digits.length);}
var s=this.digits;var decpos=s.length-this.dec;var eVal=decpos-1;if(eStt>0&&Math.abs(eVal)>=eStt){var s1=s.substr(0,1)+"."+s.substr(1);s1=s1.replace(/0+$/,'');if(s1.charAt(s1.length-1)=="."){s1=s1.substr(0,s1.length-1);}
if(eVal>0){s=s1+"e+"+eVal;}else{s=s1+"e"+eVal;}}else{if(decpos<0){s="0."+"0".repeat(-decpos)+s;}else if(decpos==0){s="0."+s;}else if(decpos>0){if(this.dec>=0){s=s.substr(0,decpos)+"."+s.substr(decpos,this.dec);}else{s=s+"0".repeat(-this.dec)+".";}}
if(s.charAt(s.length-1)=="."){s=s.substring(0,s.length-1);}}
if(this.sign==-1){if(s!="0"){s="-"+s;}}
this.dec=decWas;this.digits=digitsWas;return s;};Num.prototype.compareDigits=function(x,y){if(x.length>y.length){return 1;}
if(x.length<y.length){return-1;}
for(var i=0;i<x.length;i++){if(x.charAt(i)<y.charAt(i)){return-1;}
if(x.charAt(i)>y.charAt(i)){return 1;}}
return 0;};Num.prototype.splitWholeFrac=function(){var s=this.digits;var decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
var wholePart=s.substr(0,decpos);var fracPart=s.substr(decpos);if(fracPart.replace(/^0+/,'').length==0){fracPart="";}else{fracPart="0."+fracPart;}
return[wholePart,fracPart];};Num.prototype.fullBaseWhole=function(d,base){var baseStr=base.toString();var dWhole=this.fullDivide(d,baseStr,0);var dRem=this.fullSubtract(d,this.fullMultiply(dWhole,baseStr));if(dWhole=="0"){return this.baseDigits.charAt(dRem>>0);}else{return this.fullBaseWhole(dWhole,base)+this.baseDigits.charAt(dRem>>0);}};Num.prototype.fullBaseFrac=function(d,base,places,level){level=typeof level!=='undefined'?level:0;var r=this.fullMultiply(d,base.toString());var parts=r.split(".");var wholePart=parts[0];if(parts.length==1||level>=places-1){return this.baseDigits.charAt(wholePart>>0);}else{var fracPart="0."+parts[1];return this.baseDigits.charAt(wholePart>>0)+this.fullBaseFrac(fracPart,base,places,level+1);}};Num.prototype.getSignStr=function(){if(this.sign==-1){return "-";}else{return "";}};Num.prototype.getWholeStr=function(){var s=this.digits;var decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
return s.substr(0,decpos);};Num.prototype.getDecStr=function(){var s=this.digits;var decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
return s.substr(decpos);};function padLeft(s,n,padChar){while(s.length<n)
s=padChar+s;return s;}
if(!String.prototype.repeat){console.log("String.prototype.repeat");String.prototype.repeat=function(count){'use strict';var str=''+this;count=+count;if(count!=count){count=0;}
count=Math.floor(count);if(str.length==0||count==0){return '';}
var rpt='';for(;;){if((count&1)==1){rpt+=str;}
count>>>=1;if(count==0){break;}
str+=str;}
return rpt;}}

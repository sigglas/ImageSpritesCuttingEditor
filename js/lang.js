var a=window.location.pathname;
var l=a.split('/');
var lang=l[l.length-2];


$(document).ready(function(){
	if(Deplang)
	{
		$(Deplang).each(function(){
			window.document.body.innerHTML=window.document.body.innerHTML.replace('{'+this[0]+'}',this[1]);
		});
	}
});

function getDeplang(str){
 var arr=jQuery.grep(Deplang, function( n, i ) {
  return ( n[0]==str);
});
 if(arr[0]){return arr[0][1];}else return str;
}

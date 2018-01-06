function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
  var context = "";
  if (r != null)
    context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}

function numFormat(num) {
  return (Math.abs(num) < 10) ? "0" + parseInt(num) : num;
}
var format = {
  size: function (size) {
    var unit = ["B", "KB", "MB", "GB"];
    for (var i = 0; i < unit.length; i++) {
      if (size < Math.pow(1024, i + 1)) {
        return parseInt(size / Math.pow(1024, i) * 10) / 10 + unit[i];
      }
    }
  },
  count:function(count){
    var unitNumber=["","万","亿"];
    for(var i=0;i<unitNumber.length;i++){
      if(count<Math.pow(10000,i+1)){
        return parseInt(count/ Math.pow(10000, i) * 10) / 10 + unitNumber[i];
      }
    }
  },
  elapsedTime: function (time) {
    if (time >= 30 * 86400) {
      if (time < 365 * 86400) {
        return parseInt(time / 86400 / 30) + "月前";
      }
      else {
        return parseInt(time / 86400 / 365) + "年前";
      }
    }
    else {
      if (time >= 86400) {
        return parseInt(time / 86400) + "天前";
      }
      else if (time >= 3600) {
        return parseInt(time / 3600) + "小时前";
      }
      else if (time >= 60) {
        return parseInt(time / 60) + "分钟前";
      }
      else {
        return "刚刚";
      }
    }
  },
  date: function (time) {
    var date = new Date();
    time && date.setTime(time);
    var d = date.getFullYear() + "-" + numFormat(date.getMonth() + 1) + "-" + numFormat(date.getDate());
    var t = numFormat(date.getHours()) + ":" + numFormat(date.getMinutes());
    var monthday = numFormat(date.getMonth() + 1) + '/' +  numFormat(date.getDate());
    return ({ date: d, time: t, full: d + " " + t ,monthday: monthday});
  }
};

function transInnerHTML(innerHTML) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(innerHTML.replace(/^ *| *$/g, "")));
  return div.innerHTML;
}

//时间戳
function unixToTime(unixTime){
  var timeobj=new Date(unixTime);
  var year = timeobj.getFullYear();
  var month=timeobj.getMonth()+1;
  var date=timeobj.getDate();
  var hour=timeobj.getHours();
  var minute=timeobj.getMinutes();
  var seconds=timeobj.getSeconds();
  var timeStr=year+'-';
  timeStr=timeStr+(month<10?'0':'')+month+'-';
  timeStr=timeStr+(date<10?'0':'')+date+' ';
  timeStr=timeStr+(hour<10?'0':'')+hour+':';
  timeStr=timeStr+(minute<10?'0':'')+minute+':';
  timeStr=timeStr+(seconds<10?'0':'')+seconds;
  return timeStr;
}


function loading(col){
  var loading=$('<div>');
  loading.append(
    '<div class="load-container">'+
    '<div class="loader">'+
    '<div class="left-transparent"></div>'+
    '<div class="right-transparent"></div>'+
    '</div>'+
    '<div class="clearfix"></div>'+
    '</div>'
  )
  var loadTr=$('<tr>',{'class':'loading'});
  var loadTd=$('<td>',{'colspan':col});
  loadTd.append(loading);
  loadTr.append(loadTd);
  return loadTr;
}

function queryString(id) {
    var e = {};
    try {
        var qs = document.URL.split('?')[1].split('&');
    }
    catch (ex) {
        return null;
    }
    if (!isNaN(id)) return e[qs[id].split('=')[1]];
    for (var i = 0; i < qs.length; i++) {
        e[qs[i].split('=')[0].toLowerCase()] = qs[i].split('=')[1];
    }
    if (id) {
        return e[id.toLowerCase()];
    }
    return e;
}

/*对数字的四舍五入*/
function toDecimal(num){
  var f = parseFloat(num);
  if(isNaN(f)){
    return false;
  }
  f = Math.round(num*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if(rs<0){
    rs = s.length;
    s += '.'
  }
  while(s.length <= rs + 2){
    s += '0'
  }
  return s;
}
function blankTable(id, col) {
  col = col || 3;
  $(id).append(
    '<tr class="nodataTr">' +
    '<td colspan= "' + col + '" style="text-align: center"><span class="no-data" >暂无数据</span></td>' +
    '</tr>'
  );
}

function prompt(name,msg,type,callback){

  if(!$('#editModal').length) {
    window.editModal = $('<div class="modal fade editModal" id="editModal" tabindex="-1" role="dialog" >');
    document.body.appendChild(window.editModal[0]);

    var objDialog = $('<div/>',{class:"modal-dialog",role:"document"});
    var objContent = $('<div/>',{class:"modal-content"});
    var objHeader = $('<div/>',{class:"modal-header"});
    var objBody = $('<div/>',{class:"modal-body"});
    var objFooter = $('<div/>',{class:"modal-footer"});



    objHeader.append(
        '<button type="button" class="close" data-dismiss="modal" aria-label="close">' +
        '<span aria-hidden="true">&times;</span>'+
        '</button>'+
        '<h5 class="modal-title" style="margin-left: -15px;border-left: 4px solid #3278b3;padding-left: 10px"></h5>'
    );


    objContent.append(objHeader);
    objContent .append(objBody);
    objContent.append(objFooter);
    objDialog.append(objContent);
    window.editModal.append(objDialog);

  }
  var main = $('#editModal');
  var header = main.find('.modal-header');
  var body = main.find('.modal-body');
  var footer = main.find('.modal-footer');

  body.empty();
  footer.empty();

  header.find('h5').html(name);


  /*判断提示框type类型*/
  /*1、ask类型是询问是否取消、或者确定*/
  /*2、right类型是提示正确的提示信息*/
  /*3、error类型是提示错误的提示信息*/

  var btnSure = $('<button type="button" class="btn btn-primary btnSure" data-dismiss="modal">确定</button>');
  var btnCancle = $('<button type="button" class="btn btn-default btnOff" data-dismiss="modal">取消</button>');

  btnSure.click(function(){
    $('#editModal').remove();
    $('.modal-backdrop').remove();
    if(callback){
      callback();
    }
  });

  if(type == 'ask'){
    body.append(
        '<img src="'+ask+'" style="vertical-align:bottom">'+
        '<span>'+msg+'</span>'
    );
    footer.append(btnCancle).append(btnSure);

  }else if (type == 'right'){
    body.append(
        '<img src="'+right+'" style="vertical-align:bottom">'+
        '<span>'+msg+'</span>'
    );
    footer.append(btnSure);

    setTimeout(1000,function(){
      $('#editModal').modal('hide')
    })

  }else if(type == 'error'){
    body.append(
        '<img src="'+error+'" style="vertical-align:bottom">'+
        '<span>'+msg+'</span>'
    );
    footer.append(btnSure);

  }else if (type == 'loading'){
    body.append(
        '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'+
        '<p>'+msg+'</p>'
    );
  }

  $('#editModal').modal('show');
}

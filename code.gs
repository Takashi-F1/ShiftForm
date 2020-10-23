//const target = "2020/09" 
function createDateList(target){
  let lastDate = new Date(String(target+"/01"));
  lastDate.setMonth(lastDate.getMonth()+1);
  lastDate.setDate(0);//target月の月末日付
  var array = [];
  
  let i=1;
  while(true){
    const d=new Date(String(target+"/"+i));
    array.push(d);
    if(i==lastDate.getDate()){
      break;
    }
    i++;
  } 
  return array;
}

function createEventForm(target) {
  const colName = ['昼','夜前半','夜後半'];
  const dayList = ['日', '月', '火', '水', '木', '金', '土'];
  const GASform = FormApp.create(target+'シフト');
  GASform.setAllowResponseEdits(true);
//GASform.setDescription('説明');
  var dateList = createDateList(target);
  dateList = dateList.map(
    function(value){
      const e = dayList[value.getDay()];
      return String(Utilities.formatDate(value, 'Asia/Tokyo', 'MM/dd (')) + e +')';
    }
  );
  
  //Question
  GASform.addTextItem().setTitle('名前').setRequired(true); //必須
  GASform.addTextItem().setTitle('希望金額').setRequired(true).setHelpText('例：2～3万円'); //必須
  GASform.addCheckboxGridItem().setTitle('シフト入力').setColumns(colName).setRows(dateList);
  GASform.addParagraphTextItem().setTitle('備考');  
  //URL取得
  const longOwnUrl = GASform.getEditUrl();
  const longDisUrl = GASform.getPublishedUrl();
  return [GASform.shortenFormUrl(longOwnUrl),GASform.shortenFormUrl(longDisUrl)];
}

function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate();
}

function doPost(posted){
  let urlList = createEventForm(String(posted.parameters.target));
  var result = HtmlService.createTemplateFromFile("result");
  result.OwnUrl = urlList[0];
  result.DisUrl = urlList[1];
  return result.evaluate();
}
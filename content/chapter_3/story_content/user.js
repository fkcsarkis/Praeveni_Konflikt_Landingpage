function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6dH3dnR1mSq":
        Script1();
        break;
  }
}

function Script1()
{
        if(parent.parent){
            parent.parent.postMessage("WbtCompleted", "*")
        }
}


function ExecuteScript(strId)
{
  switch (strId)
  {
      case "66B9z034t3b":
        Script1();
        break;
  }
}

function Script1()
{
      <script type="text/javascript">
        document.querySelector('button').addEventListener("click", function () {
            parent.postMessage("WbtCompleted", "*")
        });
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  electronAPI: {
    setActiveView: (viewIndex: number) => void;
    createNewView: (url?: string) => void;
    performWindowAction: (action: "close" | "minimize" | "maximize") => void;

    onTitleChange: (callback: CallableFunction) => void;
    onNewViewCreated: (callback: CallableFunction) => void;
  };
}

if (window.electronAPI) {
  const buttonClose = document.querySelector("#button-close");
  buttonClose.addEventListener("click", () => {
    window.electronAPI.performWindowAction("close");
  });

  const buttonMinimize = document.querySelector("#button-minimize");
  buttonMinimize.addEventListener("click", () => {
    window.electronAPI.performWindowAction("minimize");
  });

  const buttonMaximize = document.querySelector("#button-maximize");
  buttonMaximize.addEventListener("click", () => {
    window.electronAPI.performWindowAction("maximize");
  });

  const buttonPlus = document.querySelector("#button-plus");
  buttonPlus.addEventListener("click", () => {
    window.electronAPI.createNewView();
  });

  window.electronAPI.onTitleChange((viewIndex: string, title: string) => {
    const button = document.querySelector(`#button-${viewIndex}`);
    if (button) {
      button.textContent = title;
    }
  });

  window.electronAPI.onNewViewCreated((title?: string) => {
    const tabsContainer = document.querySelector("#tabs-container");
    const buttonElement = document.createElement("button");
    const buttonIndex = tabsContainer.children.length + 1;

    buttonElement.textContent = title || "Loading...";
    buttonElement.id = `button-${buttonIndex}`;

    buttonElement.addEventListener("click", () => {
      window.electronAPI.setActiveView(buttonIndex);
    });

    tabsContainer.appendChild(buttonElement);
  });
}

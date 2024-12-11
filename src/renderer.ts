// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  electronAPI: {
    setActiveView: (viewIndex: number) => void;
    destroyView: (viewIndex: number) => void;
    createNewView: (url?: string) => void;
    performWindowAction: (action: "close" | "minimize" | "maximize") => void;

    onTitleChange: (callback: CallableFunction) => void;
    onNewViewCreated: (callback: CallableFunction) => void;
    onNewViewDestoyed: (callback: CallableFunction) => void;
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
    const tabElement = Array.from(document.querySelectorAll("#tab-element"))[
      +viewIndex - 1
    ];
    const buttonElement = tabElement.querySelector("#tab-button");

    if (buttonElement) {
      buttonElement.textContent = title;
    }
  });

  window.electronAPI.onNewViewCreated((title?: string) => {
    const tabsContainer = document.querySelector("#tabs-container");
    const tabButtonTemplate = document.querySelector(
      "#tab-button-template"
    ) as HTMLTemplateElement;

    const tabElement = tabButtonTemplate.content.cloneNode(true) as HTMLElement;

    const buttonElement = tabElement.querySelector("#tab-button");

    buttonElement.textContent = title || "Loading...";

    buttonElement.addEventListener("click", (event: MouseEvent) => {
      const index = Array.from(tabsContainer.children).indexOf(
        (event.currentTarget as HTMLDivElement).parentElement
      );

      window.electronAPI.setActiveView(index + 1);
    });

    const buttonCloseElement = tabElement.querySelector("#tab-button-close");

    buttonCloseElement.addEventListener("click", (event: MouseEvent) => {
      const index = Array.from(tabsContainer.children).indexOf(
        (event.currentTarget as HTMLDivElement).parentElement
      );

      tabsContainer.removeChild(tabsContainer.children[index]);

      window.electronAPI.destroyView(index + 1);
    });

    tabsContainer.appendChild(tabElement);
  });
}

export const panels = [
    {
        chartType: "bar",
        enabled: true,
        dataProperty: "revenue",
        icon: "assets/dollar.svg",
        header: "Revenue by Solution",
        summaryText: "Revenue stream",
        buttonText: "Revenue Analysis",
        additionalHtml: "$"
    },
    {
        chartType: "line",
        enabled: true,
        dataProperty:"installations",
        icon:"assets/arrow.svg",
        header:"Installations",
        summaryText:"Installations",
        buttonText:"View Installations",
        additionalHtml:""
    }
];
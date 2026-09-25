async function exportCsv() {
    const jsonFile = await fetch("./data/dealers.json");
    const data = await jsonFile.json();

    const headers = Object.keys(data[0]);

    const csv = [
        headers.join(","),
        ...data.map(row =>
            headers.map(h => row[h]).join(",")
        )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dealers.csv";
    a.click();
}

exportCsv();
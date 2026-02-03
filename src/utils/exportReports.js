

export const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),

    ...rows.map(row =>
      headers
        .map(h => `"${row[h] ?? ""}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();

  window.URL.revokeObjectURL(url);
};
document.addEventListener("DOMContentLoaded", () => {
  updateTimeSpent();
  setInterval(updateTimeSpent, 1000);
});

function updateTimeSpent() {
  chrome.storage.local.get(["totalTimeSpent"], (result) => {
    const totalTimeSpent = result.totalTimeSpent || 0;
    const formattedTime = formatTime(totalTimeSpent);
    document.getElementById(
      "timeSpent"
    ).textContent = `Total Time: ${formattedTime}`;
  });
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formattedTime = hours.toString().padStart(2, "0") + ":";
  formattedTime += minutes.toString().padStart(2, "0") + ":";
  formattedTime += seconds.toString().padStart(2, "0");
  return formattedTime;
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.totalTimeSpent) {
    updateTimeSpent();
  }
});

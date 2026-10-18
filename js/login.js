document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {

      // Reset all tabs and panels first
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      // Activate the clicked tab and its matching panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      targetPanel.classList.add('active');

    });
  });

});
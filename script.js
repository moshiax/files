document.addEventListener("DOMContentLoaded", function() {
    const repoOwner = "moshiax";
    const repoName = "files";
    const filePath = "exe";
    const fileListElement = document.getElementById("file-list");

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`)
        .then(response => response.json())
        .then(data => {
            const files = data.filter(file => file.name.endsWith('.exe'));

            files.forEach(file => {
                const fileName = file.name.replace('.exe', '');
                const pngIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.png`;
                const icoIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.ico`;

                const fileItem = document.createElement("div");
                fileItem.className = "file-item";

                const fileIcon = document.createElement("img");
                const fileLink = document.createElement("a");
                fileLink.href = file.download_url;
                fileLink.innerText = file.name;
                fileLink.style.color = getRandomColor();

                fileIcon.src = pngIconUrl;
                fileIcon.onerror = () => {
                    fileIcon.src = icoIconUrl;
                    fileIcon.onerror = () => {
                        console.error(`Neither PNG nor ICO icons were found for ${file.name}`);
                    };
                };

                fileItem.appendChild(fileIcon);
                fileItem.appendChild(fileLink);
                fileItem.addEventListener('click', () => {
                    window.location.href = file.download_url;
                });

                fileListElement.appendChild(fileItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

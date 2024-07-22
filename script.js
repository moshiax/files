document.addEventListener("DOMContentLoaded", function() {
    const repoOwner = "moshiax";
    const repoName = "files";
    const filePath = "exe";
    const fileListElement = document.getElementById("file-list");

    const filesToFetch = [
        { name: "CreamInstaller.zip", download_url: "https://github.com/pointfeev/CreamInstaller/releases/latest/download/CreamInstaller.zip" }
    ];

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`)
        .then(response => response.json())
        .then(data => {
            const repoFiles = data.filter(file => file.name.endsWith('.exe') || file.name.endsWith('.rar'));
            repoFiles.forEach(file => {
                filesToFetch.push({ name: file.name, download_url: file.download_url });
            });

            filesToFetch.forEach(file => {
                const fileName = file.name.replace(/\.(exe|rar|zip)$/, '');
                const pngIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.png`;
                const icoIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.ico`;

                const fileItem = document.createElement("div");
                fileItem.className = "file-item";

                const fileIcon = document.createElement("img");
                const fileLink = document.createElement("a");
                fileLink.href = file.download_url;
                fileLink.innerText = fileName;
                fileLink.style.color = "white";

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

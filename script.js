document.addEventListener("DOMContentLoaded", function() {
    const repoOwner = "moshiax";
    const repoName = "files";
    const filePath = "exe";
    const fileListElement = document.getElementById("file-list");

    const filesToFetch = [
        { name: "CreamInstaller.zip", download_url: "https://github.com/pointfeev/CreamInstaller/releases/latest/download/CreamInstaller.zip" },

        { name: "balenaEtcher-1.19.21.Setup.exe", download_url: "https://github.com/balena-io/etcher/releases/download/v1.19.21/balenaEtcher-1.19.21.Setup.exe", icon: "balenaEtcher.png" }
    ];

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`)
        .then(response => response.json())
        .then(data => {
            const repoFiles = data.filter(file => file.name.endsWith('.exe') || file.name.endsWith('.rar'));
            repoFiles.forEach(file => {
                filesToFetch.push({ name: file.name, download_url: file.download_url });
            });

            const processedFiles = {};

            filesToFetch.forEach(file => {
                const fileName = file.name.replace(/\.(exe|rar|zip)$/, '');
                const parentFileName = file.parent ? file.parent.replace(/\.(exe|rar|zip)$/, '') : null;

                if (parentFileName) {
                    if (!processedFiles[parentFileName]) {
                        processedFiles[parentFileName] = [];
                    }
                    processedFiles[parentFileName].push(file);
                } else {
                    processedFiles[fileName] = [file];
                }
            });

            Object.keys(processedFiles).forEach(fileName => {
                const files = processedFiles[fileName];
                const pngIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.png`;
                const icoIconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.ico`;

                const fileItem = document.createElement("div");
                fileItem.className = "file-item";

                const fileIcon = document.createElement("img");
                fileIcon.src = fileName === "balenaEtcher" ? `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/balenaEtcher.png` : pngIconUrl;
                fileIcon.onerror = () => {
                    fileIcon.src = icoIconUrl;
                    fileIcon.onerror = () => {
                        console.error(`Neither PNG nor ICO icons were found for ${fileName}`);
                    };
                };

                const fileContainer = document.createElement("div");
                fileContainer.className = "file-container";

                files.forEach((file, index) => {
                    const fileLink = document.createElement("a");
                    fileLink.href = file.download_url;
                    fileLink.innerText = file.name.replace(/\.(exe|rar|zip)$/, '');
                    fileLink.style.color = "white";
                    if (index > 0) {
                        fileLink.className = "nested-file";
                        fileLink.style.display = "inline-block";
                        fileLink.style.marginLeft = "10px";
                        fileLink.style.borderRadius = "50%";
                        fileLink.style.width = "32px";
                        fileLink.style.height = "32px";
                        fileLink.style.backgroundImage = "url('/mnt/data/123123.png')";
                        fileLink.style.backgroundSize = "cover";
                        fileLink.style.textIndent = "-9999px";
                        fileLink.style.overflow = "hidden";
                        fileLink.style.whiteSpace = "nowrap";
                    }
                    fileLink.addEventListener('click', (event) => {
                        event.stopPropagation();
                        window.location.href = file.download_url;
                    });
                    fileContainer.appendChild(fileLink);
                });

                fileItem.appendChild(fileIcon);
                fileItem.appendChild(fileContainer);
                fileItem.addEventListener('click', () => {
                    window.location.href = files[0].download_url;
                });

                fileListElement.appendChild(fileItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
});

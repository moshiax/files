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
                const iconUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}/${fileName}.ico`;

                const fileItem = document.createElement("div");
                fileItem.className = "file-item";

                const fileIcon = document.createElement("img");
                fileIcon.src = iconUrl;
                fileIcon.onerror = () => fileIcon.src = 'default-icon-path.ico'; 

                const fileLink = document.createElement("a");
                fileLink.href = file.download_url;
                fileLink.innerText = file.name;

                fileItem.appendChild(fileIcon);
                fileItem.appendChild(fileLink);
                fileListElement.appendChild(fileItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
});

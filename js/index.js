document.addEventListener("DOMContentLoaded", () => {
    let form = document.getElementById('github-form');
    let submitBtn = document.getElementById('submit');
    let searchInput = document.getElementById('search');
    let gitHubContainer = document.getElementById('github-container');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });

    submitBtn.addEventListener('click', handleSubmit);
    function handleSubmit(e) {
        e.preventDefault();
        let inputValue = searchInput.value;
        console.log(inputValue);

        // Fetch 
        let fetchUrl = `https://api.github.com/search/users?q=${inputValue}`;
        fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            gitHubContainer.innerHTML = ''; // Clear the container before appending new user cards

            data.items.forEach(user => {
                let userContainer = document.createElement('div');
                userContainer.className = 'user-card';

                let avatarImg = document.createElement('img');
                avatarImg.src = user.avatar_url;
                avatarImg.className = 'avatar';

                let username = document.createElement('p');
                username.textContent = user.login;

                let gitHubLink = document.createElement('a');
                gitHubLink.href = user.html_url;
                gitHubLink.textContent = ('GitHub page');

                userContainer.appendChild(avatarImg);
                userContainer.appendChild(username);
                userContainer.appendChild(gitHubLink);

                userContainer.addEventListener('click', function() {

                    // Fetch repositories for the clicked user
                    let userDetailUrl = `https://api.github.com/users/${user.login}/repos`;
                    fetch(userDetailUrl)
                    .then(response => response.json())
                    .then(userDetailData => {
                        // Create a container for repositories
                        let repoContainer = document.createElement('div');
                        repoContainer.className = 'repos';
                        let repoLinkContainer = document.createElement('div');
                        repoLinkContainer.className = 'repo-links';
                        let repoHeading = document.createElement('h1');
                        repoHeading.textContent = ('Repositories')

                        userDetailData.forEach(repo => {
                            let repoLink = document.createElement('a');
                            repoLink.href = repo.html_url;
                            repoLink.textContent = repo.name;
                            repoLinkContainer.appendChild(repoLink);
                        });

                        // Append repositories to the user card
                        userContainer.appendChild(repoHeading);
                        userContainer.appendChild(repoLinkContainer);
                    })
                    .catch(error => {
                        console.error("Error fetching user repositories:", error);
                    });
                });

                gitHubContainer.appendChild(userContainer);
            });
        })
        .catch(error => {
            console.error("Error fetching GitHub users:", error);
        });
    }
});

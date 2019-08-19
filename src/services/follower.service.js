const newFollowerTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div class='nd_container'>
            <h3 class="username">Hi There,</h3>
            <p class="message">
                <p class="username">${userName} is now following you on Authors Haven</p>
            </p>
        </div>
        <div class="button_cont">
            <a class="example_c" href=${url} target="_blank" rel="nofollow noopener">View Profile</a>
        </div>
</body>

</html>`;

export default newFollowerTemplate;

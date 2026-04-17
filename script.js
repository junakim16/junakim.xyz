document.addEventListener('DOMContentLoaded', function () {
    var titles = document.querySelectorAll('#titles li');
    var texts = document.querySelectorAll('#texts li');
    var previews = document.querySelectorAll('#preview .preview-item');

    titles.forEach(function (title) {
        title.addEventListener('click', function (e) {
            e.preventDefault();
            var id = this.id;

            // Update selected title
            titles.forEach(function (t) { t.classList.remove('selected'); });
            title.classList.add('selected');

            // Show matching text
            texts.forEach(function (t) { t.style.display = 'none'; });
            var matchingText = document.querySelector('#texts li#' + id);
            if (matchingText) matchingText.style.display = 'list-item';

            // Show matching preview
            previews.forEach(function (p) { p.style.display = 'none'; });
            var matchingPreview = document.querySelector('#preview .' + id);
            if (matchingPreview) matchingPreview.style.display = 'block';
        });
    });
});

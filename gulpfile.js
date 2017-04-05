var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8080,
            AWS_ACCESS_KEY_ID: 'AKIAJROOZXSXDF2ILODQ',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_REGION: 'us-west-2'
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function () {
            console.log('Restarting');
        });
});
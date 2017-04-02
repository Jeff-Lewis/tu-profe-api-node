var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8080,
            AWS_ACCESS_KEY_ID: 'AKIAJH3O5HZIQBV3WR6A',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_REGION: 'us-west-2'
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function () {
            console.log('Restarting');
        });
});
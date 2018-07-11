我在 [Deepin](https://www.deepin.org/) 用 [Tower](https://tower.im) 来管理研发团队.

这个项目的目标是用 Ruby on Rails 重新构建一个 Tower.im 一样的协作工具出来, 主要用于验证我学到的 Rails/Html5/CSS/JS 等知识是否理解透彻.

### MacOS 上安装 Rails
```Bash
$ brew install rvm
$ echo "ruby_url=https://cache.ruby-china.org/pub/ruby" > ~/.rvm/user/db
$ rvm requirements
$ rvm install 5.2.0
$ rvm use 5.2.0 --default
$ gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
$ gem install rails
```

### 使用方法
```Bash
$ git clone git@github.com:manateelazycat/tower-ng.git
$ cd tower-ng
$ bundle update
$ rails server
``
然后在浏览器中访问 0.0.0.0:3000

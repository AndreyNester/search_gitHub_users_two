class View {
  constructor(){
    this.app = document.getElementById('app');
    
    this.title = this.createElement('h1', 'title');
    this.title.textContent = 'GitHub Search Users';

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchCounter = this.createElement('span', 'counter');
    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.usersWrapper = this.createElement('div', 'users-wrapper');
    this.usersList = this.createElement('ul', 'users');
    this.usersWrapper.append(this.usersList);

    this.main = this.createElement('div', 'main');
    this.main.append(this.usersWrapper);

    this.loadMore = this.createElement('button', 'btn')
    this.loadMore.textContent = `Load More`;
    this.loadMore.style.display = 'none'
    this.usersWrapper.append(this.loadMore);

    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.app.append(this.main);

  }

  createElement(elemTag, elemClass){
    const element = document.createElement(elemTag);
    if (elemClass) element.classList.add(elemClass);
    return element;
  }

  createUser (dataUser) {

    const userElement = this.createElement('li' , 'user-prev');
    userElement.innerHTML = `<img class ='user-prev-photo' src ='${dataUser.avatar_url}' alt='${dataUser.login}' >
    <span>${dataUser.login}</span>`

    this.usersList.append(userElement)
  }

  toggleLoadMoreBtn = (show) => this.loadMore.style.display = show ? 'block' : 'none';

}


//================      search     ============


const USER_PER_PAGE = 10;


class Serach {

  setCurrentPage (pageNumber) {
    this.currentPage = pageNumber;
  }

  constructor (view){
    this.view = view;
    this.currentPage = 1;

    this.view.searchInput.addEventListener('keyup', this.debounce(this.loadUsers.bind(this), 500) )
    this.view.loadMore.addEventListener('click', this.loadUsers.bind(this))
  }

  async loadUsers () {

    if (this.view.searchInput.value) {
      this.clearUsers();
      await fetch(`https://api.github.com/search/users?q=${this.view.searchInput.value}&per_page=${USER_PER_PAGE}&page=${this.currentPage}`)
      .then( (res)=> {
        if (res.ok) {

          this.setCurrentPage(this.currentPage + 1)
          return res.json()
        };
      })
      .then((res)=>{
        res.items.forEach( (elem)=> this.view.createUser(elem) )

        this.view.toggleLoadMoreBtn(this.view.usersList.childNodes.length < res.total_count && this.view.usersList.childNodes.length !== res.total_count);

        console.log(res.total_count);
        console.log(this.view.usersList.childNodes.length);
      })

    }else {
      this.clearUsers();
      this.view.toggleLoadMoreBtn(false)
    }


  }

  clearUsers = () => this.view.usersList.innerHTML = '';


  debounce = (fn, debounceTime) => {
    let timeout;
    return function () {
      const fnCall = ()=> fn.apply(this, arguments);
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, debounceTime);
    }

  }

  



}

new Serach(new View());
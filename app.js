'use strict';
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-toggle');
function closeMenu() { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => {const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown',event => { if(event.key==='Escape') closeMenu(); });
const orderDialog = document.getElementById('order-dialog');
const readerDialog = document.getElementById('reader-dialog');
let returnFocus;
document.addEventListener('click', event => {
 const order = event.target.closest('[data-order]');
 if (order) { returnFocus=order;document.getElementById('order-form').reset();document.getElementById('order-product').value=order.dataset.order;orderDialog.showModal(); }
 const recipe = event.target.closest('[data-recipe]');
 if (recipe) {returnFocus=recipe;const template=document.getElementById(recipe.dataset.recipe);document.getElementById('reader-content').replaceChildren(template.content.cloneNode(true));readerDialog.showModal();readerDialog.scrollTop=0;}
 if (event.target.closest('.close-dialog')) event.target.closest('dialog').close();
 const download=event.target.closest('[data-download-recipe]');
 if(download){const content=document.querySelector('#reader-content .prose');const text=Array.from(content.querySelectorAll('p')).map(x=>x.textContent).join('\n\n');const blob=new Blob([download.dataset.downloadRecipe+'\n\n'+text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=download.dataset.downloadRecipe+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
});
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>returnFocus?.focus());
});
document.getElementById('order-form')?.addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);
 const text=`Здравствуйте!\n\nИнтересует: ${data.get('product')}\nИмя: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nПисьмо подготовлено на демонстрационной версии BodreevShow.`;
 const url='mailto:zernabor@mail.ru?subject='+encodeURIComponent('BodreevShow: '+data.get('product'))+'&body='+encodeURIComponent(text);
 window.location.href=url;showToast('Письмо подготовлено. Отправьте его в почтовой программе.');
});
function showToast(text){const toast=document.querySelector('.toast');toast.textContent=text;toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),6500);}
let recipeFilter='all';
function applySearch(input){const query=input.value.toLocaleLowerCase('ru').trim();const cards=[...document.querySelectorAll(input.dataset.searchTarget)];let shown=0;cards.forEach(card=>{const match=card.dataset.search.includes(query)&&(!card.classList.contains('recipe-card')||recipeFilter==='all'||card.dataset.new==='true');card.hidden=!match;if(match)shown++;});const empty=input.closest('section')?.querySelector('.empty-state');if(empty)empty.hidden=shown>0;}
document.querySelectorAll('[data-search-target]').forEach(input=>input.addEventListener('input',()=>applySearch(input)));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{recipeFilter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});const input=document.querySelector('[data-search-target=".recipe-card"]');if(input)applySearch(input);}));

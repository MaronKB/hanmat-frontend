import styles from './GridContainer.module.css';
export default function GridContainer({id, img, title, dscrn}: {id: string, img: string, title: string, dscrn: string}) {
    const openModal = () => {
        const modal = document.createElement("div");
        modal.className = styles.modal;
        modal.innerHTML = `
            <div class="${styles.modalContent}">
                <img id="${id}" src="${img}" alt="${title}" />
                <h3>${title}</h3>
                <p>${dscrn}</p>
                <button class="${styles.closeBtn}">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target === modal.querySelector(`.${styles.closeBtn}`)) {
                modal.remove();
            }
        });
    }
    return (
        <div className={styles.container} onClick={openModal}>
            <img src={img} alt={title} />
            <h3>{title.split("(")[0]}</h3>
        </div>
    );
}
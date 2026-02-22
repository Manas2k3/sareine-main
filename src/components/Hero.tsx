import HeroAnimation from './HeroAnimation';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <header id="hero-wrapper" className={styles.heroWrapper}>
            <div className={styles.stickyContainer}>
                {/* 
            All logic, including text overlays and animations, 
            is now handled inside HeroAnimation to strictly sync with scroll 
        */}
                <HeroAnimation />
            </div>
        </header>
    );
}

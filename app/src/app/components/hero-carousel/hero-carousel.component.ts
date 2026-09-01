import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  HostListener,
  inject,
  NgZone,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

export interface CarouselSlide {
  id: number;
  badge: string;
  badgeIcon: string;
  badgeType: 'fire' | 'green' | 'gold' | 'blue' | 'purple';
  tag: string;
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaRoute: string;
  ctaSecondaryText?: string;
  ctaSecondaryRoute?: string;
  image?: string;
  imageAlt?: string;
  floatingBadges?: {
    icon: string;
    text: string;
    subtext?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }[];
  theme: {
    bgGradient: string;
    accentColor: string;
    accentBg: string;
    textColor: string;
    glowColor: string;
  };
}

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule]
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private autoplayTimer: any = null;
  private readonly AUTOPLAY_DURATION = 6000; // 6 segundos por slide

  // Estado Reativo com Signals
  readonly currentIndex = signal<number>(0);
  readonly isPaused = signal<boolean>(false);
  readonly isDragging = signal<boolean>(false);
  readonly dragOffset = signal<number>(0);

  private touchStartX = 0;
  private touchCurrentX = 0;

  readonly slides: CarouselSlide[] = [
    {
      id: 0,
      badge: 'OFERTA DA SEMANA',
      badgeIcon: 'local_fire_department',
      badgeType: 'fire',
      tag: 'Nutrição Super Premium',
      title: 'Alimentação Completa',
      highlightText: 'Até 40% OFF + Frete Grátis',
      subtitle: 'Seu pet mais saudável, ativo e feliz',
      description: 'As melhores marcas de ração como Royal Canin, Premier e Hills com descontos exclusivos e entrega expressa no mesmo dia.',
      ctaText: 'Aproveitar Descontos',
      ctaRoute: '/',
      ctaSecondaryText: 'Ver Todas as Rações',
      ctaSecondaryRoute: '/',
      image: 'assets/mock/racao_royal_canin.png',
      imageAlt: 'Ração Royal Canin Nutrição Premium',
      floatingBadges: [
        {
          icon: 'verified',
          text: 'Super Premium',
          subtext: '100% Garantido',
          position: 'top-right'
        },
        {
          icon: 'local_shipping',
          text: 'Frete Grátis',
          subtext: 'Em compras acima de R$ 99',
          position: 'bottom-left'
        }
      ],
      theme: {
        bgGradient: 'linear-gradient(135deg, #FFF9F2 0%, #FFEED9 45%, #FFE1BA 100%)',
        accentColor: '#3C2A20',
        accentBg: 'rgba(60, 42, 32, 0.08)',
        textColor: '#3C2A20',
        glowColor: 'rgba(255, 178, 91, 0.35)'
      }
    },
    {
      id: 1,
      badge: 'REDE CREDENCIADA',
      badgeIcon: 'location_on',
      badgeType: 'green',
      tag: 'Mapa de Lojas & Clínicas',
      title: 'Encontre Petshops e Vets',
      highlightText: 'Mais de 120 Parceiros Próximos',
      subtitle: 'Comodidade e atendimento de confiança na sua região',
      description: 'Localize clínicas veterinárias 24h, centros de estética e petshops parceiras direto pelo mapa interativo com cálculo de rota.',
      ctaText: 'Explorar Lojas no Mapa',
      ctaRoute: '/stores',
      ctaSecondaryText: 'Buscar por CEP',
      ctaSecondaryRoute: '/stores',
      image: 'assets/mock/coleira_gps.png',
      imageAlt: 'Localização e parceiros Pet Stores',
      floatingBadges: [
        {
          icon: 'near_me',
          text: 'Busca por Raio',
          subtext: 'Até 20 km de você',
          position: 'top-left'
        },
        {
          icon: 'storefront',
          text: '120+ Lojas',
          subtext: 'Abertas agora',
          position: 'bottom-right'
        }
      ],
      theme: {
        bgGradient: 'linear-gradient(135deg, #F4FBF7 0%, #E3F6EC 45%, #D0EFE0 100%)',
        accentColor: '#1B4332',
        accentBg: 'rgba(27, 67, 50, 0.08)',
        textColor: '#1B4332',
        glowColor: 'rgba(45, 106, 79, 0.25)'
      }
    },
    {
      id: 2,
      badge: 'SPA & BEM-ESTAR',
      badgeIcon: 'spa',
      badgeType: 'gold',
      tag: 'Higiene & Estética Pet',
      title: 'Banho & Tosa com Carinho',
      highlightText: 'Agendamento Online Sem Filas',
      subtitle: 'Cuidado profissional e produtos hipoalergênicos',
      description: 'Reserve o melhor horário para o banho, tosa higiênica e hidratação do seu pet com os melhores profissionais avaliados pelos tutores.',
      ctaText: 'Agendar Horário',
      ctaRoute: '/stores',
      ctaSecondaryText: 'Ver Profissionais',
      ctaSecondaryRoute: '/stores',
      image: 'assets/mock/shampoo_neutro.png',
      imageAlt: 'Produtos de Banho e Estética Pet',
      floatingBadges: [
        {
          icon: 'clean_hands',
          text: 'Hipoalergênico',
          subtext: 'pH Balanceado',
          position: 'top-right'
        },
        {
          icon: 'star',
          text: 'Avaliação 4.9',
          subtext: '+2.400 tutores felizes',
          position: 'bottom-left'
        }
      ],
      theme: {
        bgGradient: 'linear-gradient(135deg, #FAF6FF 0%, #EFE8FF 45%, #DFD0FF 100%)',
        accentColor: '#382260',
        accentBg: 'rgba(56, 34, 96, 0.08)',
        textColor: '#382260',
        glowColor: 'rgba(123, 75, 209, 0.25)'
      }
    },
    {
      id: 3,
      badge: 'LANÇAMENTO EXCLUSIVO',
      badgeIcon: 'stars',
      badgeType: 'blue',
      tag: 'Conforto & Tecnologia',
      title: 'Camas Ortopédicas e Coleiras',
      highlightText: 'Conforto Máximo para seu Pet',
      subtitle: 'Design ergonômico, tecidos laváveis e durabilidade',
      description: 'Proporcione noites de sono perfeitas e passeios seguros com a nova linha de caminhas ultra-soft e coleiras com rastreamento integrado.',
      ctaText: 'Ver Linha Conforto',
      ctaRoute: '/',
      ctaSecondaryText: 'Conferir Coleiras GPS',
      ctaSecondaryRoute: '/',
      image: 'assets/mock/cama_pet_g.png',
      imageAlt: 'Cama Pet Conforto G Ortopédica',
      floatingBadges: [
        {
          icon: 'bedtime',
          text: 'Memory Foam',
          subtext: 'Alívio nas articulações',
          position: 'top-left'
        },
        {
          icon: 'water_drop',
          text: 'Tecido Impermeável',
          subtext: 'Fácil higienização',
          position: 'bottom-right'
        }
      ],
      theme: {
        bgGradient: 'linear-gradient(135deg, #F0F7FF 0%, #DEEEFF 45%, #C2DEFF 100%)',
        accentColor: '#1A365D',
        accentBg: 'rgba(26, 54, 93, 0.08)',
        textColor: '#1A365D',
        glowColor: 'rgba(49, 130, 206, 0.25)'
      }
    },
    {
      id: 4,
      badge: 'ADOTE COM AMOR',
      badgeIcon: 'favorite',
      badgeType: 'purple',
      tag: 'Responsabilidade Social',
      title: 'Feira de Adoção Responsável',
      highlightText: 'Encontre seu Novo Melhor Amigo',
      subtitle: 'Centenas de cães e gatos esperando por um lar',
      description: 'Parceria da Pet Stores com ONGs credenciadas. Todos os animais são vacinados, castrados e microchipados prontos para receber carinho.',
      ctaText: 'Conhecer Pets para Adoção',
      ctaRoute: '/stores',
      ctaSecondaryText: 'Como Apoiar ONGs',
      ctaSecondaryRoute: '/',
      image: 'assets/mock/lancador_bolinhas.png',
      imageAlt: 'Feira de Adoção Pet Stores',
      floatingBadges: [
        {
          icon: 'pets',
          text: '350+ Adotados',
          subtext: 'Vidas transformadas',
          position: 'top-right'
        },
        {
          icon: 'medical_services',
          text: '100% Vacinados',
          subtext: 'Check-up completo',
          position: 'bottom-left'
        }
      ],
      theme: {
        bgGradient: 'linear-gradient(135deg, #FFF5F7 0%, #FFE3EB 45%, #FFCCD9 100%)',
        accentColor: '#6B1B38',
        accentBg: 'rgba(107, 27, 56, 0.08)',
        textColor: '#6B1B38',
        glowColor: 'rgba(219, 39, 119, 0.25)'
      }
    }
  ];

  readonly currentSlide = computed(() => this.slides[this.currentIndex()]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // Navegação
  goTo(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex.set(index);
      this.restartAutoplay();
    }
  }

  next(): void {
    const nextIndex = (this.currentIndex() + 1) % this.slides.length;
    this.goTo(nextIndex);
  }

  prev(): void {
    const prevIndex = (this.currentIndex() - 1 + this.slides.length) % this.slides.length;
    this.goTo(prevIndex);
  }

  // Autoplay
  private startAutoplay(): void {
    this.stopAutoplay();
    this.zone.runOutsideAngular(() => {
      this.autoplayTimer = setInterval(() => {
        if (!this.isPaused()) {
          this.zone.run(() => this.next());
        }
      }, this.AUTOPLAY_DURATION);
    });
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Interações de Mouse e Foco
  onMouseEnter(): void {
    this.isPaused.set(true);
  }

  onMouseLeave(): void {
    this.isPaused.set(false);
  }

  // Navegação por Teclado
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'ArrowLeft') {
      this.prev();
    }
  }

  // Suporte a Touch / Swipe Mobile
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
    this.isDragging.set(true);
    this.isPaused.set(true);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    this.touchCurrentX = event.touches[0].clientX;
    const delta = this.touchCurrentX - this.touchStartX;
    // Limita o arrasto visual para feedback tátil suave
    this.dragOffset.set(Math.max(-80, Math.min(80, delta)));
  }

  onTouchEnd(): void {
    if (!this.isDragging()) return;
    const delta = this.touchCurrentX - this.touchStartX;
    const threshold = 45; // pixels para acionar o swipe

    if (delta > threshold) {
      this.prev();
    } else if (delta < -threshold) {
      this.next();
    }

    this.isDragging.set(false);
    this.dragOffset.set(0);
    this.isPaused.set(false);
  }
}


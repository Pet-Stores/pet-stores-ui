import { Component, OnInit, signal, inject, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('mainImage') mainImageRef!: ElementRef<HTMLImageElement>;

  public product = signal<Product | null>(null);
  public selectedImage = signal<string>('');
  public isShowingVideo = signal<boolean>(false);
  public safeVideoUrl = signal<SafeResourceUrl | null>(null);
  
  // Estados para o Zoom Lateral (Estilo Amazon)
  public isZooming = signal<boolean>(false);
  public lensStyle = signal<any>({});
  public zoomViewerStyle = signal<any>({});

  // Estados para o Lightbox
  public isLightboxOpen = signal<boolean>(false);
  public currentLightboxIndex = signal<number>(0);

  public quantity = signal<number>(1);
  public relatedProducts = signal<Product[]>([]);

  public isFavorite = computed(() => {
    const p = this.product();
    return p ? this.favoritesService.isFavorite(p.id) : false;
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
      window.scrollTo(0, 0);
    });
  }

  private loadProduct(id: number) {
    const p = this.productService.getProductById(id);
    if (p) {
      this.product.set(p);
      this.selectedImage.set(p.images[0]);
      this.isShowingVideo.set(false);
      this.relatedProducts.set(this.productService.getRelatedProducts(id));
      this.quantity.set(1);
      
      if (p.videoUrl) {
        this.safeVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(p.videoUrl));
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  public selectImage(img: string) {
    this.selectedImage.set(img);
    this.isShowingVideo.set(false);
  }

  public selectVideo() {
    this.isShowingVideo.set(true);
  }

  // LÓGICA DO ZOOM LATERAL (ESTILO AMAZON)
  public onMouseMove(e: MouseEvent) {
    if (this.isShowingVideo() || !this.isZooming()) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    
    // Tamanho da lente (proporcional ao zoom)
    const lensWidth = 150;
    const lensHeight = 150;

    // Posição do mouse relativa ao container
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Garantir que a lente não saia do container
    let posX = x - lensWidth / 2;
    let posY = y - lensHeight / 2;

    if (posX < 0) posX = 0;
    if (posY < 0) posY = 0;
    if (posX > rect.width - lensWidth) posX = rect.width - lensWidth;
    if (posY > rect.height - lensHeight) posY = rect.height - lensHeight;

    // Atualiza estilo da lente
    this.lensStyle.set({
      'left': `${posX}px`,
      'top': `${posY}px`,
      'width': `${lensWidth}px`,
      'height': `${lensHeight}px`
    });

    // Calcula a porcentagem do zoom para o visualizador lateral
    const zoomX = (posX / (rect.width - lensWidth)) * 100;
    const zoomY = (posY / (rect.height - lensHeight)) * 100;

    this.zoomViewerStyle.set({
      'background-image': `url("${this.selectedImage()}")`,
      'background-position': `${zoomX}% ${zoomY}%`,
      'background-size': '250%' // Ampliação de 2.5x no visualizador
    });
  }

  public toggleZoom(state: boolean) {
    if (!this.isShowingVideo() && window.innerWidth > 1024) {
      this.isZooming.set(state);
    }
  }

  // Lightbox
  public openLightbox() {
    if (this.isShowingVideo()) return;
    const p = this.product();
    if (p) {
      const index = p.images.indexOf(this.selectedImage());
      this.currentLightboxIndex.set(index >= 0 ? index : 0);
      this.isLightboxOpen.set(true);
      document.body.style.overflow = 'hidden';
    }
  }

  public closeLightbox() {
    this.isLightboxOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  public nextLightboxImage(e: Event) {
    e.stopPropagation();
    const p = this.product();
    if (p) {
      this.currentLightboxIndex.update(idx => (idx + 1) % p.images.length);
    }
  }

  public prevLightboxImage(e: Event) {
    e.stopPropagation();
    const p = this.product();
    if (p) {
      this.currentLightboxIndex.update(idx => (idx - 1 + p.images.length) % p.images.length);
    }
  }

  public incrementQty() {
    if (this.quantity() < (this.product()?.stock || 0)) {
      this.quantity.update(q => q + 1);
    }
  }

  public decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  public toggleFavorite() {
    const p = this.product();
    if (p) {
      this.favoritesService.toggleFavorite({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0],
        sellerName: p.sellerName
      });
    }
  }

  public addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: this.quantity(),
        sellerName: p.sellerName,
        image: p.images[0],
        selected: true
      });
      
      this.snackBar.open('Produto adicionado ao carrinho!', 'Ver Carrinho', {
        duration: 3000,
        panelClass: ['success-snackbar']
      }).onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    }
  }

  public buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }
}

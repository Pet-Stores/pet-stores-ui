import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoreService, PartnerStore } from '../../services/store.service';
import { NavbarComponent } from '../navbar/navbar.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-stores-map',
  templateUrl: './stores-map.component.html',
  styleUrls: ['./stores-map.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class StoresMapComponent implements OnInit, AfterViewInit, OnDestroy {
  public storeService = inject(StoreService);

  @ViewChild('mapContainer', { static: false })
  mapContainerRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private userMarker: L.Marker | null = null;
  private storeMarkers: L.Marker[] = [];

  // Estado Local
  public cepInput = signal<string>('');
  public selectedStore = signal<PartnerStore | null>(null);
  public searchQuery = signal<string>('');

  // Sinais do serviço
  public userLocation = this.storeService.userLocation;
  public hasCep = this.storeService.hasCep;
  public isLoadingLocation = this.storeService.isLoadingLocation;
  public isLoadingStores = this.storeService.isLoadingStores;
  public cepError = this.storeService.cepError;
  public categories = this.storeService.getStoreCategories();
  public selectedCategory = this.storeService.selectedCategory;
  public radiusKm = this.storeService.radiusKm;

  // Lojas filtradas por categoria + busca textual
  public displayedStores = computed(() => {
    const stores = this.storeService.filteredStores();
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return stores;
    return stores.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.neighborhood.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    const loc = this.userLocation();
    if (loc?.cep) {
      this.cepInput.set(loc.cep);
    }
  }

  ngAfterViewInit(): void {
    // Pequeno timeout para garantir que o DOM e dimensões estejam prontos
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // ─── Inicialização do Mapa Leaflet ─────────────────────────────────────────
  private initMap(): void {
    if (!this.mapContainerRef || !this.mapContainerRef.nativeElement) return;

    const loc = this.userLocation();
    const initialLat = loc ? loc.lat : -25.3582;
    const initialLng = loc ? loc.lng : -49.2062;
    const initialZoom = loc ? 14 : 13;

    this.map = L.map(this.mapContainerRef.nativeElement, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
    });

    // Zoom control customizado no canto superior direito
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Tile Layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Forçar recálculo de tamanho do container Leaflet para evitar blocos cinzas/quebrados
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 250);

    this.updateMapMarkers();
  }

  // ─── Atualização de Marcadores no Mapa ────────────────────────────────────
  public updateMapMarkers(): void {
    if (!this.map) return;

    // Remove marcadores anteriores
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
      this.userMarker = null;
    }
    this.storeMarkers.forEach(m => this.map?.removeLayer(m));
    this.storeMarkers = [];

    const loc = this.userLocation();

    // Marcador do Usuário
    if (loc) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="user-pulse-ring"></div>
          <div class="user-pin-dot">
            <span class="material-icons">person_pin_circle</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
        popupAnchor: [0, -36]
      });

      this.userMarker = L.marker([loc.lat, loc.lng], { icon: userIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="popup-user-content">
            <strong>Sua Localização</strong>
            <p>${loc.neighborhood ? loc.neighborhood + ', ' : ''}${loc.city} (${loc.cep || 'GPS'})</p>
          </div>
        `);
    }

    // Marcadores das Lojas Parceiras
    const stores = this.displayedStores();
    const bounds: L.LatLngExpression[] = [];

    if (loc) {
      bounds.push([loc.lat, loc.lng]);
    }

    stores.forEach(store => {
      bounds.push([store.lat, store.lng]);

      const storeIcon = L.divIcon({
        className: 'custom-store-marker',
        html: `
          <div class="store-pin ${store.openNow ? 'is-open' : 'is-closed'}">
            <span class="material-icons">storefront</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([store.lat, store.lng], { icon: storeIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div class="popup-store-card">
            <h4>${store.name}</h4>
            <p class="popup-addr">${store.address} - ${store.neighborhood}</p>
            <div class="popup-meta">
              <span class="popup-rating">★ ${store.rating} (${store.reviewCount})</span>
              <span class="popup-status ${store.openNow ? 'open' : 'closed'}">
                ${store.openNow ? 'Aberto agora' : 'Fechado'}
              </span>
            </div>
            ${store.distance !== undefined ? `<span class="popup-distance">📍 ${store.distance.toFixed(1)} km de você</span>` : ''}
          </div>
        `);

      marker.on('click', () => {
        this.selectedStore.set(store);
      });

      this.storeMarkers.push(marker);
    });

    // Ajustar zoom para enquadrar pontos
    if (bounds.length > 1) {
      this.map.fitBounds(bounds as L.LatLngBoundsExpression, {
        padding: [60, 60],
        maxZoom: 15
      });
    } else if (loc) {
      this.map.setView([loc.lat, loc.lng], 14);
    }
  }

  // ─── Ações de Busca ────────────────────────────────────────────────────────
  async onCepSubmit(): Promise<void> {
    await this.storeService.searchByCep(this.cepInput());
    if (this.map) {
      this.map.invalidateSize();
    }
    this.updateMapMarkers();
  }

  async onUseGeolocation(): Promise<void> {
    await this.storeService.getUserGeolocation();
    const loc = this.userLocation();
    if (loc?.cep) {
      this.cepInput.set(loc.cep);
    }
    if (this.map) {
      this.map.invalidateSize();
    }
    this.updateMapMarkers();
  }

  formatCep(value: string): void {
    const digits = value.replace(/\D/g, '').substring(0, 8);
    const formatted = digits.length > 5
      ? `${digits.substring(0, 5)}-${digits.substring(5)}`
      : digits;
    this.cepInput.set(formatted);
  }

  // ─── Filtros ───────────────────────────────────────────────────────────────
  onSelectCategory(catId: string): void {
    this.storeService.setCategory(catId);
    setTimeout(() => this.updateMapMarkers(), 50);
  }

  onSelectRadius(km: number): void {
    this.storeService.setRadius(km);
    setTimeout(() => this.updateMapMarkers(), 300);
  }

  focusStoreOnMap(store: PartnerStore): void {
    this.selectedStore.set(store);
    if (!this.map) return;
    this.map.flyTo([store.lat, store.lng], 16, {
      animate: true,
      duration: 1
    });

    const idx = this.displayedStores().findIndex(s => s.id === store.id);
    if (idx !== -1 && this.storeMarkers[idx]) {
      this.storeMarkers[idx].openPopup();
    }
  }
}

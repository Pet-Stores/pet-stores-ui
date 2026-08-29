import { Injectable, signal, computed } from '@angular/core';

// =============================================================================
// INTERFACES
// =============================================================================

export interface StoreCategory {
  id: string;
  label: string;
  icon: string;
}

export interface PartnerStore {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  image: string;
  openNow: boolean;
  openHours: string;
  distance?: number; // km, calculado dinamicamente
}

export interface UserLocation {
  cep: string;
  lat: number;
  lng: number;
  city: string;
  neighborhood: string;
  state: string;
}

// =============================================================================
// CATEGORIAS
// =============================================================================

export const STORE_CATEGORIES: StoreCategory[] = [
  { id: 'all', label: 'Todas', icon: 'storefront' },
  { id: 'petshop', label: 'Petshop', icon: 'pets' },
  { id: 'vet', label: 'Veterinária', icon: 'medical_services' },
  { id: 'banho', label: 'Banho e Tosa', icon: 'shower' },
  { id: 'racao', label: 'Ração e Nutrição', icon: 'local_dining' },
  { id: 'hotel', label: 'Hotel Pet', icon: 'hotel' },
];

// =============================================================================
// MOCK DATABASE DE LOJAS PARCEIRAS (Colombo - PR / Campo Pequeno & Curitiba Região)
// Localização base usuário: Campo Pequeno, Colombo - PR (Lat: -25.3582, Lng: -49.2062)
// =============================================================================

const MOCK_STORES: PartnerStore[] = [
  {
    id: 1,
    name: 'PetShop Patas & Garras Colombo',
    address: 'Av. São Gabriel, 1420',
    neighborhood: 'Campo Pequeno',
    city: 'Colombo',
    state: 'PR',
    cep: '83404-190',
    lat: -25.3575,
    lng: -49.2050,
    phone: '(41) 3663-1234',
    rating: 4.9,
    reviewCount: 248,
    categories: ['petshop', 'banho', 'racao'],
    image: 'assets/img/stores/petshop-royal.jpg',
    openNow: true,
    openHours: 'Seg–Sáb: 8h30–19h',
  },
  {
    id: 2,
    name: 'Clínica Veterinária Vida Animal',
    address: 'Rua Pedro do Rosário, 310',
    neighborhood: 'Campo Pequeno',
    city: 'Colombo',
    state: 'PR',
    cep: '83404-050',
    lat: -25.3595,
    lng: -49.2085,
    phone: '(41) 3663-8899',
    rating: 4.8,
    reviewCount: 312,
    categories: ['vet', 'racao'],
    image: 'assets/img/stores/vet-premium.jpg',
    openNow: true,
    openHours: 'Seg–Sex: 8h–20h | Sáb: 8h–14h',
  },
  {
    id: 3,
    name: 'Estética Animal Banho & Charme',
    address: 'Rua das Flores, 88',
    neighborhood: 'Maracanã',
    city: 'Colombo',
    state: 'PR',
    cep: '83405-200',
    lat: -25.3640,
    lng: -49.1990,
    phone: '(41) 3562-4411',
    rating: 4.7,
    reviewCount: 156,
    categories: ['banho'],
    image: 'assets/img/stores/banho-tosa.jpg',
    openNow: true,
    openHours: 'Ter–Sáb: 8h30–18h',
  },
  {
    id: 4,
    name: 'NutriPet Colombo — Rações e Acessórios',
    address: 'Rodovia da Uva, 2400',
    neighborhood: 'Roça Grande',
    city: 'Colombo',
    state: 'PR',
    cep: '83402-000',
    lat: -25.3480,
    lng: -49.2150,
    phone: '(41) 3656-7788',
    rating: 4.6,
    reviewCount: 189,
    categories: ['racao', 'petshop'],
    image: 'assets/img/stores/nutri-pet.jpg',
    openNow: true,
    openHours: 'Seg–Sáb: 8h–19h30',
  },
  {
    id: 5,
    name: 'Hospital Veterinário 24h Colombo',
    address: 'Estrada da Ribeira, 1850',
    neighborhood: 'Guaraituba',
    city: 'Colombo',
    state: 'PR',
    cep: '83410-000',
    lat: -25.3420,
    lng: -49.1850,
    phone: '(41) 3666-2424',
    rating: 4.9,
    reviewCount: 520,
    categories: ['vet'],
    image: 'assets/img/stores/vetcare.jpg',
    openNow: true,
    openHours: 'Atendimento 24 Horas',
  },
  {
    id: 6,
    name: 'Pet Resort & Hotel Cão Feliz',
    address: 'Rua Marginal Direita, 500',
    neighborhood: 'Santa Cândida',
    city: 'Curitiba',
    state: 'PR',
    cep: '82640-020',
    lat: -25.3720,
    lng: -49.2220,
    phone: '(41) 3357-9900',
    rating: 4.8,
    reviewCount: 142,
    categories: ['hotel', 'banho'],
    image: 'assets/img/stores/hotel-patas.jpg',
    openNow: false,
    openHours: 'Todos os dias: 7h–21h',
  },
  {
    id: 7,
    name: 'Mundo dos Bichos Pet Center',
    address: 'Av. Paraná, 4500',
    neighborhood: 'Santa Cândida',
    city: 'Curitiba',
    state: 'PR',
    cep: '82620-360',
    lat: -25.3780,
    lng: -49.2310,
    phone: '(41) 3256-3322',
    rating: 4.7,
    reviewCount: 395,
    categories: ['petshop', 'banho', 'racao'],
    image: 'assets/img/stores/mega-petshop.jpg',
    openNow: true,
    openHours: 'Seg–Sáb: 8h30–20h | Dom: 9h–14h',
  },
  {
    id: 8,
    name: 'Agro & Pet Shop Grãos de Ouro',
    address: 'Rua Abel Scuissiato, 1200',
    neighborhood: 'Atuba',
    city: 'Colombo',
    state: 'PR',
    cep: '83408-280',
    lat: -25.3690,
    lng: -49.2020,
    phone: '(41) 3675-5566',
    rating: 4.5,
    reviewCount: 110,
    categories: ['racao', 'petshop'],
    image: 'assets/img/stores/pet-gourmet.jpg',
    openNow: false,
    openHours: 'Seg–Sex: 8h–18h | Sáb: 8h–13h',
  },
];

// Coordenadas de referência conhecidas por região / CEP padrão
const CEP_COORDINATES_MAP: { [prefix: string]: { lat: number; lng: number; city: string; neighborhood: string; state: string } } = {
  '83404': { lat: -25.3582, lng: -49.2062, city: 'Colombo', neighborhood: 'Campo Pequeno', state: 'PR' },
  '83405': { lat: -25.3640, lng: -49.1990, city: 'Colombo', neighborhood: 'Maracanã', state: 'PR' },
  '83402': { lat: -25.3480, lng: -49.2150, city: 'Colombo', neighborhood: 'Roça Grande', state: 'PR' },
  '83410': { lat: -25.3420, lng: -49.1850, city: 'Colombo', neighborhood: 'Guaraituba', state: 'PR' },
  '83408': { lat: -25.3690, lng: -49.2020, city: 'Colombo', neighborhood: 'Atuba', state: 'PR' },
  '82640': { lat: -25.3720, lng: -49.2220, city: 'Curitiba', neighborhood: 'Santa Cândida', state: 'PR' },
  '82620': { lat: -25.3780, lng: -49.2310, city: 'Curitiba', neighborhood: 'Santa Cândida', state: 'PR' },
  '80': { lat: -25.4284, lng: -49.2733, city: 'Curitiba', neighborhood: 'Centro', state: 'PR' },
  '83': { lat: -25.3582, lng: -49.2062, city: 'Colombo', neighborhood: 'Campo Pequeno', state: 'PR' },
  '01': { lat: -23.5505, lng: -46.6333, city: 'São Paulo', neighborhood: 'Centro', state: 'SP' },
};

// =============================================================================
// SERVICE
// =============================================================================

@Injectable({ providedIn: 'root' })
export class StoreService {
  // ─── Estado Reativo ───────────────────────────────────────────────────────
  public userLocation = signal<UserLocation | null>(null);
  public nearbyStores = signal<PartnerStore[]>([]);
  public isLoadingLocation = signal<boolean>(false);
  public isLoadingStores = signal<boolean>(false);
  public cepError = signal<string>('');
  public selectedCategory = signal<string>('all');
  public radiusKm = signal<number>(15);

  // ─── Computed ────────────────────────────────────────────────────────────
  public hasCep = computed(() => !!this.userLocation());

  public filteredStores = computed(() => {
    const cat = this.selectedCategory();
    const stores = this.nearbyStores();
    if (cat === 'all') return stores;
    return stores.filter(s => s.categories.includes(cat));
  });

  public topNearbyStores = computed(() =>
    this.nearbyStores().slice(0, 4)
  );

  constructor() {
    this.loadSavedLocation();
  }

  // ─── Persistência ─────────────────────────────────────────────────────────
  private loadSavedLocation(): void {
    try {
      const saved = localStorage.getItem('user_location');
      if (saved) {
        const loc: UserLocation = JSON.parse(saved);
        this.userLocation.set(loc);
        this.loadNearbyStores(loc.lat, loc.lng);
      } else {
        // Padrão de demonstração: Campo Pequeno, Colombo - PR
        const defaultLoc: UserLocation = {
          cep: '83404-190',
          neighborhood: 'Campo Pequeno',
          city: 'Colombo',
          state: 'PR',
          lat: -25.3582,
          lng: -49.2062,
        };
        this.userLocation.set(defaultLoc);
        this.saveLocation(defaultLoc);
        this.loadNearbyStores(defaultLoc.lat, defaultLoc.lng);
      }
    } catch { /* ignora erro de parse */ }
  }

  private saveLocation(loc: UserLocation): void {
    localStorage.setItem('user_location', JSON.stringify(loc));
  }

  clearLocation(): void {
    localStorage.removeItem('user_location');
    this.userLocation.set(null);
    this.nearbyStores.set([]);
  }

  // ─── CEP → Coordenadas (Nativo com Fetch + Fallback seguro) ─────────────────
  async searchByCep(rawCep: string): Promise<void> {
    const cep = rawCep.replace(/\D/g, '');
    if (cep.length !== 8) {
      this.cepError.set('CEP deve ter 8 dígitos.');
      return;
    }

    this.isLoadingLocation.set(true);
    this.cepError.set('');

    try {
      const prefix5 = cep.substring(0, 5);
      const prefix2 = cep.substring(0, 2);
      const baseInfo = CEP_COORDINATES_MAP[prefix5] || CEP_COORDINATES_MAP[prefix2] || {
        lat: -25.3582,
        lng: -49.2062,
        city: 'Colombo',
        neighborhood: 'Campo Pequeno',
        state: 'PR'
      };

      // Tenta ViaCEP via fetch nativo do navegador
      let city = baseInfo.city;
      let neighborhood = baseInfo.neighborhood;
      let state = baseInfo.state;
      let formattedCep = `${cep.substring(0, 5)}-${cep.substring(5)}`;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            city = data.localidade || city;
            neighborhood = data.bairro || neighborhood;
            state = data.uf || state;
            formattedCep = data.cep || formattedCep;
          }
        }
      } catch {
        // Se houver erro de rede / CORS no ViaCEP, usa o fallback do mapa de coordenadas
      }

      const loc: UserLocation = {
        cep: formattedCep,
        city,
        neighborhood,
        state,
        lat: baseInfo.lat + (parseInt(cep.substring(5, 7) || '0', 10) % 10 - 5) * 0.002,
        lng: baseInfo.lng + (parseInt(cep.substring(6, 8) || '0', 10) % 10 - 5) * 0.002,
      };

      this.userLocation.set(loc);
      this.saveLocation(loc);
      this.loadNearbyStores(loc.lat, loc.lng);
    } catch (e) {
      this.cepError.set('Erro ao buscar CEP. Verifique o número digitado.');
    } finally {
      this.isLoadingLocation.set(false);
    }
  }

  // ─── Geolocalização Nativa ────────────────────────────────────────────────
  async getUserGeolocation(): Promise<void> {
    if (!navigator.geolocation) {
      this.cepError.set('Geolocalização não suportada pelo navegador.');
      return;
    }

    this.isLoadingLocation.set(true);
    this.cepError.set('');

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: UserLocation = {
            cep: '83404-190',
            city: 'Colombo',
            neighborhood: 'Campo Pequeno',
            state: 'PR',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          this.userLocation.set(loc);
          this.saveLocation(loc);
          this.loadNearbyStores(loc.lat, loc.lng);
          this.isLoadingLocation.set(false);
          resolve();
        },
        (_err) => {
          this.cepError.set('Permissão de localização negada. Use o CEP.');
          this.isLoadingLocation.set(false);
          resolve();
        },
        { timeout: 10000 }
      );
    });
  }

  // ─── Carregar Lojas Próximas ───────────────────────────────────────────────
  loadNearbyStores(lat: number, lng: number): void {
    this.isLoadingStores.set(true);

    const radius = this.radiusKm();
    const withDistance = MOCK_STORES
      .map(store => ({
        ...store,
        distance: this.haversineDistance(lat, lng, store.lat, store.lng),
      }))
      .filter(s => s.distance <= radius)
      .sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99));

    setTimeout(() => {
      this.nearbyStores.set(withDistance);
      this.isLoadingStores.set(false);
    }, 250);
  }

  // ─── Haversine Distance (km) ───────────────────────────────────────────────
  haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // ─── Setters de filtros ────────────────────────────────────────────────────
  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  setRadius(km: number): void {
    this.radiusKm.set(km);
    const loc = this.userLocation();
    if (loc) this.loadNearbyStores(loc.lat, loc.lng);
  }

  getCategoryLabel(id: string): string {
    return STORE_CATEGORIES.find(c => c.id === id)?.label ?? id;
  }

  getCategoryIcon(id: string): string {
    return STORE_CATEGORIES.find(c => c.id === id)?.icon ?? 'store';
  }

  getStoreCategories(): StoreCategory[] {
    return STORE_CATEGORIES;
  }
}

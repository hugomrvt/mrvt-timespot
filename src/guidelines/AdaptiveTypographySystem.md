# Système de Typographie Adaptative TimeSpot

## Vue d'ensemble

Le système de typographie adaptative de TimeSpot assure que le texte de l'heure s'ajuste automatiquement pour rester lisible et visible sur tous les appareils, quelle que soit la largeur de l'écran ou la longueur du texte affiché.

## Composants Principaux

### 1. Hook `useAdaptiveTextSize`

Ce hook calcule dynamiquement la taille de police optimale basée sur :
- **Largeur de l'écran** : Utilise `useBreakpoint` pour détecter la taille de l'appareil
- **Contenu du texte** : Analyse la longueur et les caractères pour estimer l'espace requis
- **Format de l'heure** : Ajuste pour 12h vs 24h (12h prend moins d'espace)
- **Contraintes** : Respect des tailles min/max définies

```typescript
const { getAdaptiveStyle, getAdaptiveClasses } = useAdaptiveTextSize({
  text: timeText,
  timeFormat,
  containerPadding: 32,
  minFontSize: 48,
  maxFontSize: 280
});
```

### 2. Composant `AdaptiveText`

Composant réutilisable qui encapsule la logique adaptative :
- Mesure automatique du texte
- Application des styles adaptatifs
- Support de différents éléments HTML (span, div, h1, etc.)

### 3. CSS `clamp()` Integration

Utilisation de la fonction CSS `clamp()` pour une adaptation fluide :
```css
font-size: clamp(min, preferred, max);
```

## Breakpoints et Adaptations

### Très Petits Écrans (< 320px)
- **Taille** : `clamp(2rem, 12vw, 4rem)`
- **Stratégie** : Priorité à la lisibilité, réduction maximale

### Petits Écrans (321px - 489px)
- **Taille** : `clamp(2.5rem, 14vw, 5.5rem)`
- **Stratégie** : Équilibre entre taille et espace

### Mobile Standard (490px - 768px)
- **Taille** : `clamp(4rem, 16vw, 7.5rem)`
- **Stratégie** : Optimisation pour portrait mobile

### Tablette (769px - 1024px)
- **Taille** : `clamp(6rem, 18vw, 11rem)`
- **Stratégie** : Exploitation de l'espace disponible

### Desktop (> 1025px)
- **Taille** : `clamp(8rem, 20vw, 17.5rem)`
- **Stratégie** : Taille maximale pour impact visuel

## Facteurs d'Adaptation

### 1. Estimation de la Largeur du Texte

```typescript
const estimateTextWidth = (text: string, fontSize: number): number => {
  const charWidth = fontSize * 0.6; // Space Grotesk ratio
  
  for (const char of text) {
    if (char === ':') width += charWidth * 0.3;      // Deux-points étroits
    else if (/\d/.test(char)) width += charWidth * 0.55; // Chiffres
    else width += charWidth * 0.5;                   // Autres caractères
  }
  
  return width;
};
```

### 2. Ajustement par Format d'Heure

- **Format 12h** : Multiplicateur de 0.85 (texte plus court)
- **Format 24h** : Multiplicateur de 1.0 (texte standard)

### 3. Contraintes par Appareil

- **Mobile** : Padding réduit, tailles conservatrices
- **Tablette** : Équilibre entre espace et lisibilité
- **Desktop** : Utilisation maximale de l'espace disponible

## Implementation dans les Composants

### ResponsivePrimaryTimeDisplay

```typescript
const { getAdaptiveStyle, fontSize } = useAdaptiveTextSize({
  text: timeText,
  timeFormat,
  containerPadding: isVerySmall ? 16 : isMobile ? 24 : 32,
  minFontSize: isVerySmall ? 32 : 48,
  maxFontSize: isVerySmall ? 85 : isMobile ? 120 : 280
});

// Application du style adaptatif
<span style={{
  ...getAdaptiveStyle(),
  fontWeight: 400,
  letterSpacing: '-0.02em'
}}>
  {displayTime.time}
</span>
```

### TimeZoneCard

```typescript
const getTimeSize = () => {
  if (isMobile) return 'text-[clamp(1.25rem,5vw,2rem)]';
  if (isTablet) return 'text-[clamp(1.5rem,4vw,2.25rem)]';
  return 'text-[clamp(1.75rem,3vw,2rem)]';
};
```

## Fonctionnalités Avancées

### Container Queries (Future)

Support des container queries pour une adaptation encore plus précise :
```css
@container (max-width: 400px) {
  .time-display {
    font-size: clamp(2rem, 12cqw, 4rem);
  }
}
```

### Performance

- **Debouncing** : Calculs différés pour éviter les re-calculs excessifs
- **Memoization** : Cache des calculs coûteux
- **Estimation** : Évite les mesures DOM quand possible

## Bonnes Pratiques

### 1. Hiérarchie des Techniques
1. CSS `clamp()` pour l'adaptation de base
2. Hook `useAdaptiveTextSize` pour les cas complexes
3. JavaScript manual pour les cas exceptionnels

### 2. Contraintes de Lisibilité
- **Taille minimale** : 32px pour les très petits écrans
- **Contraste** : Maintien des ratios de contraste WCAG
- **Espacement** : Préservation des espaces entre caractères

### 3. Test et Validation
- Test sur appareils réels
- Validation avec différentes longueurs de texte
- Vérification des cas edge (texte très long/court)

## Debugging

### Outils de Debug
```typescript
// Dans useAdaptiveTextSize
console.log({
  text,
  fontSize,
  estimatedWidth: estimateTextWidth(text, fontSize),
  availableWidth: width - containerPadding * 2
});
```

### Indicateurs Visuels (Dev Mode)
- Bordures colorées pour visualiser les conteneurs
- Overlay des calculs de largeur
- Métriques en temps réel

Ce système garantit une expérience utilisateur optimale sur tous les appareils en s'adaptant intelligemment aux contraintes d'espace disponible.
import { describe, it, expect } from 'vitest';
import { distanceMiles, boundingBox } from '../../utils/geo';

describe('Geo utilities', () => {
  describe('distanceMiles', () => {
    it('returns 0 for the same point', () => {
      const result = distanceMiles(40.7128, -74.006, 40.7128, -74.006);
      expect(result).toBe(0);
    });

    it('calculates approximate distance between New York and Los Angeles', () => {
      // NYC: 40.7128, -74.0060 | LA: 34.0522, -118.2437
      // Known distance: ~2,451 miles
      const result = distanceMiles(40.7128, -74.006, 34.0522, -118.2437);
      expect(result).toBeGreaterThan(2400);
      expect(result).toBeLessThan(2500);
    });

    it('calculates approximate distance between London and Paris', () => {
      // London: 51.5074, -0.1278 | Paris: 48.8566, 2.3522
      // Known distance: ~213 miles
      const result = distanceMiles(51.5074, -0.1278, 48.8566, 2.3522);
      expect(result).toBeGreaterThan(200);
      expect(result).toBeLessThan(225);
    });

    it('is symmetric (A to B equals B to A)', () => {
      const ab = distanceMiles(40.7128, -74.006, 34.0522, -118.2437);
      const ba = distanceMiles(34.0522, -118.2437, 40.7128, -74.006);
      expect(ab).toBeCloseTo(ba, 10);
    });

    it('handles points on the equator', () => {
      // Two points on the equator, 1 degree apart in longitude
      // At the equator, 1 degree longitude ~ 69.17 miles
      const result = distanceMiles(0, 0, 0, 1);
      expect(result).toBeGreaterThan(68);
      expect(result).toBeLessThan(70);
    });

    it('handles points on the same meridian', () => {
      // Two points on the same longitude, 1 degree apart in latitude
      // 1 degree latitude ~ 69 miles everywhere
      const result = distanceMiles(0, 0, 1, 0);
      expect(result).toBeGreaterThan(68);
      expect(result).toBeLessThan(70);
    });

    it('handles crossing the prime meridian', () => {
      const result = distanceMiles(51.5, -0.5, 51.5, 0.5);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(50);
    });

    it('handles antipodal points (roughly half circumference)', () => {
      // Roughly opposite points on the globe
      // North Pole to South Pole: ~12,436 miles (half circumference)
      const result = distanceMiles(90, 0, -90, 0);
      expect(result).toBeGreaterThan(12400);
      expect(result).toBeLessThan(12500);
    });
  });

  describe('boundingBox', () => {
    it('returns an object with minLat, maxLat, minLng, maxLng', () => {
      const box = boundingBox(40.7128, -74.006, 10);
      expect(box).toHaveProperty('minLat');
      expect(box).toHaveProperty('maxLat');
      expect(box).toHaveProperty('minLng');
      expect(box).toHaveProperty('maxLng');
    });

    it('produces a box that contains the center point', () => {
      const lat = 40.7128;
      const lng = -74.006;
      const box = boundingBox(lat, lng, 10);
      expect(box.minLat).toBeLessThan(lat);
      expect(box.maxLat).toBeGreaterThan(lat);
      expect(box.minLng).toBeLessThan(lng);
      expect(box.maxLng).toBeGreaterThan(lng);
    });

    it('produces symmetric boundaries around the center latitude', () => {
      const lat = 40.7128;
      const lng = -74.006;
      const box = boundingBox(lat, lng, 10);
      const latDeltaBelow = lat - box.minLat;
      const latDeltaAbove = box.maxLat - lat;
      expect(latDeltaBelow).toBeCloseTo(latDeltaAbove, 10);
    });

    it('produces a larger box for a larger radius', () => {
      const lat = 40.7128;
      const lng = -74.006;
      const small = boundingBox(lat, lng, 5);
      const large = boundingBox(lat, lng, 50);
      expect(large.maxLat - large.minLat).toBeGreaterThan(small.maxLat - small.minLat);
      expect(large.maxLng - large.minLng).toBeGreaterThan(small.maxLng - small.minLng);
    });

    it('handles a zero radius', () => {
      const lat = 40.7128;
      const lng = -74.006;
      const box = boundingBox(lat, lng, 0);
      expect(box.minLat).toBe(lat);
      expect(box.maxLat).toBe(lat);
      expect(box.minLng).toBe(lng);
      expect(box.maxLng).toBe(lng);
    });

    it('handles points near the equator', () => {
      const box = boundingBox(0, 0, 100);
      // At equator, lat and lng deltas should be roughly equal
      // since cos(0) = 1, so lngDelta = radiusMiles / 69
      const latRange = box.maxLat - box.minLat;
      const lngRange = box.maxLng - box.minLng;
      expect(latRange).toBeCloseTo(lngRange, 1);
    });

    it('produces wider longitude range at higher latitudes', () => {
      // At higher latitudes, longitude degrees are narrower,
      // so the bounding box lng range should be larger
      const equator = boundingBox(0, 0, 100);
      const highLat = boundingBox(60, 0, 100);
      const equatorLngRange = equator.maxLng - equator.minLng;
      const highLatLngRange = highLat.maxLng - highLat.minLng;
      expect(highLatLngRange).toBeGreaterThan(equatorLngRange);
    });

    it('produces correct approximate lat delta (radiusMiles / 69)', () => {
      const radius = 69; // exactly 1 degree of latitude
      const box = boundingBox(40, -74, radius);
      const latDelta = box.maxLat - 40;
      expect(latDelta).toBeCloseTo(1, 5);
    });
  });
});

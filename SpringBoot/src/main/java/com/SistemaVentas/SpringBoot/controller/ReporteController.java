package com.SistemaVentas.SpringBoot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    // Endpoint para obtener los 4 KPIs del resumen
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> obtenerKPIs() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalVentasMes", "S/ 18,500.00");
        kpis.put("productoTop", "Inca Kola 1.5L - 42%");
        kpis.put("variacionMensual", "+8.5% vs mes anterior");
        kpis.put("ticketPromedio", "S/ 18.50 por venta");
        
        return ResponseEntity.ok(kpis);
    }

    // Endpoint para obtener la tabla con los registros y el indicador calculados
    @GetMapping("/ventas")
    public ResponseEntity<List<Map<String, String>>> obtenerReporteVentas() {
        List<Map<String, String>> lista = new ArrayList<>();

        Map<String, String> venta1 = new HashMap<>();
        venta1.put("nVenta", "V-001");
        venta1.put("fechaHora", "15/05/2026 10:15");
        venta1.put("clienteCajero", "Cliente General / Cajero A");
        venta1.put("detalleCantidad", "Inca Kola 1.5L x2");
        venta1.put("montoTotal", "S/ 18.00");
        venta1.put("indicadorCalculado", "Participación: 42%");
        lista.add(venta1);

        Map<String, String> venta2 = new HashMap<>();
        venta2.put("nVenta", "V-002");
        venta2.put("fechaHora", "15/05/2026 10:30");
        venta2.put("clienteCajero", "Cliente General / Cajero A");
        venta2.put("detalleCantidad", "Arroz x1, Leche x1");
        venta2.put("montoTotal", "S/ 19.00");
        venta2.put("indicadorCalculado", "Prom. Operación: S/ 18.50");
        lista.add(venta2);

        return ResponseEntity.ok(lista);
    }
}
package br.com.passe.controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.dto.FiltroTransacoes;
import br.com.passe.dto.HistoricoResponse;
import br.com.passe.service.TransacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Histórico de transações", description = "Compras e vendas do clube e exportação em CSV")
@RestController
@RequestMapping("/clubs" + Rotas.ID + "/transactions")
@RequiredArgsConstructor
public class TransacaoController {

    private static final MediaType TEXT_CSV = new MediaType("text", "csv", StandardCharsets.UTF_8);

    private final TransacaoService transacaoService;

    @Operation(summary = "Histórico do clube com o resumo dos totais (RN17)")
    @GetMapping
    @Parameter(name = "type", in = ParameterIn.QUERY, description = "COMPRA, VENDA ou os dois, separados por vírgula")
    @Parameter(name = "player_id", in = ParameterIn.QUERY, description = "Só as transações desse jogador")
    public HistoricoResponse listar(
            @PathVariable int id, @Parameter(hidden = true) @RequestParam Map<String, String> parametros) {
        return transacaoService.listar(id, FiltroTransacoes.de(new ParametrosConsulta(parametros)));
    }

    @Operation(summary = "Exporta o histórico do clube em CSV (RN18)")
    @GetMapping("/export")
    @Parameter(name = "type", in = ParameterIn.QUERY, description = "COMPRA, VENDA ou os dois, separados por vírgula")
    @Parameter(name = "player_id", in = ParameterIn.QUERY, description = "Só as transações desse jogador")
    public ResponseEntity<String> exportar(
            @PathVariable int id, @Parameter(hidden = true) @RequestParam Map<String, String> parametros) {
        String csv = transacaoService.exportarCsv(id, FiltroTransacoes.de(new ParametrosConsulta(parametros)));
        ContentDisposition anexo = ContentDisposition.attachment()
                .filename("transacoes-clube-" + id + ".csv")
                .build();
        return ResponseEntity.ok()
                .contentType(TEXT_CSV)
                .header(HttpHeaders.CONTENT_DISPOSITION, anexo.toString())
                .body(csv);
    }
}

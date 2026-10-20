package br.com.passe.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.dto.PartidaRequest;
import br.com.passe.dto.PartidaResponse;
import br.com.passe.service.PartidaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Partidas", description = "Partidas e histórico de partidas")
@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class PartidaController {

    private final PartidaService partidaService;

    @Operation(summary = "Joga uma partida pelos 6 duelos e grava o resultado (RN20)")
    @PostMapping
    public ResponseEntity<PartidaResponse> jogar(@Valid @RequestBody PartidaRequest dados) {
        PartidaResponse partida = partidaService.jogar(dados);
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(partida.id())
                .toUri();
        return ResponseEntity.created(local).body(partida);
    }

    @Operation(summary = "Lista as partidas, da mais recente para a mais antiga (RN21)")
    @GetMapping
    @Parameter(
            name = "club_id",
            in = ParameterIn.QUERY,
            description = "Só as partidas em que o clube foi mandante ou visitante")
    public List<PartidaResponse> listar(@Parameter(hidden = true) @RequestParam Map<String, String> parametros) {
        return partidaService.listar(
                new ParametrosConsulta(parametros).inteiroPositivo("club_id").orElse(null));
    }

    @Operation(summary = "Consulta uma partida com os 6 duelos (RN21)")
    @GetMapping(Rotas.ID)
    public PartidaResponse buscar(@PathVariable int id) {
        return partidaService.buscar(id);
    }
}
